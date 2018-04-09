/**
 * @module upload
 * @author Edvin Larsson
 *
 * Route for uploading videos
 *
 * @requires express
 * @requires Video
 * @requires csurf
 */

'use strict'

const router = require('express').Router()
const Video = require('../../models/Video')
const path = require('path')
const Lib = require('../../lib/Lib')
const lib = new Lib()
const multer = require('multer')
const GridFsStorage = require('multer-gridfs-storage')

const csrf = require('csurf')
const csrfProtection = csrf()

// defines how to store video file uploads
const storage = new GridFsStorage({
  url: process.env.dbURL,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const extName = path.extname(file.originalname)

            // checks the file format before storing
      if (okayFormat(extName) === false) {
        return reject(new Error('Unsupported file format'))
      } else {
              // changes the file name before storing
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

      // perhaps I can use the other way of storing, could store before, retrieving was difficult
      // send in bucketname perhaps

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

        // should check first with req.files, if it has been
        // different otherwise
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
