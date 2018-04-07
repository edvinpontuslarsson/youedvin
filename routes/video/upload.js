/**
 * @module upload
 * @author Edvin Larsson
 *
 * Route for uploading videos
 *
 * @requires express
 * @requires Video
 * @requires csurf
 * @requires formidable
 * @requires mongoose
 * @requires gridfs-stream
 * @requires fs
 */

'use strict'

const router = require('express').Router()
const Video = require('../../models/Video')
const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')
const Lib = require('../../lib/Lib')
const lib = new Lib()

const csrf = require('csurf')
const csrfProtection = csrf()

const connection = mongoose.connection
const Grid = require('gridfs-stream')
const multer = require('multer')
const GridFsStorage = require('multer-gridfs-storage')
let gfs

// Inspired by: https://www.youtube.com/watch?v=3f5Q9wDePzY
connection.once('open', () => {
  gfs = Grid(connection.db, mongoose.mongo)
  gfs.collection('videoData')
  console.log('Ready for video uploads')
})

// defines how to store
const storage = new GridFsStorage({
  url: process.env.dbURL,
  file: (req, file) => {
      return new Promise((resolve, reject) => {
            const extName = path.extname(file.originalname)

            if (okayFormat(extName) === false) {
              reject(new Error('Unsupported file format'))
            } else {
              const fileName = lib.randomNrs() + extName
              const fileInfo = {
              filename: fileName,
              bucketName: 'uploads'
              }
              resolve(fileInfo)
            }
      })
  }
})
const upload = multer({ storage })

router.route('/upload')
    // renders upload form, only for logged in users
    .get(csrfProtection, (req, res) => {
      if (!req.session.username) {
        res.status(403)
        res.render('error/403')
      } else {
        res.render('video/upload', {
          csrfToken: req.csrfToken()
        })
      }
    })

    // saves video to DB, only for logged in users
    .post(csrfProtection, upload.single('video'), async (req, res) => {
      if (req.session.username) {
        const video = new Video({
          fileName: req.file.filename,
          title: req.body.title,
          description: req.body.description,
          createdBy: req.session.username,
          creatorId: req.session.userid
        })

        // saves video info in separate mongoose model
        await video.save()

        req.session.flash = {
          type: 'success',
          text: 'The Video has been succesfully uploaded!'
        }

        res.redirect('.')
      } else {
        // else if the video file was not posted by a logged in user,
        // the video gets deleted from the DB
        // should be...
        res.status(403)
        res.render('error/403')
      }
    })

/**
 * Checks file format
 * https://en.wikipedia.org/wiki/HTML5_video#Supported_video_and_audio_formats
 * @param {any} extName - filename extension
 */
function okayFormat (extName) {
  let answer = false

  if (extName === '.webm' ||
        extName === '.mp4' ||
        extName === '.m4a' ||
        extName === '.m4p' ||
        extName === '.m4b' ||
        extName === '.m4r' ||
        extName === '.m4v' ||
        extName === '.ogv' ||
        extName === '.ogg') {
    answer = true
  }

  return answer
}

module.exports = router
