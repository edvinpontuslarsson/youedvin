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

/**
 * Checks that the post comes from a logged in user,
 * also checks file format and
 * defines how to store video file uploads
 */
const storage = new GridFsStorage({
  url: process.env.dbURL,
  file: (req, file) => {
    if (!req.session.username) {
      return new Error('You cannot post unless you are logged in!')
    } else {
      return new Promise((resolve, reject) => {
        const extName = path.extname(file.originalname)

              // checks the file format before storing
        if (okayFormat(extName) === false) {
          return reject(new Error('Unsupported file format'))
        } else {
                // changes the file name before storing
          const fileName = lib.randomString() + extName
          const fileInfo = {
            filename: fileName,
            bucketName: 'uploads'
          }
          resolve(fileInfo)
        }
      })
    }
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
        res.status(200)
        res.header({ csrfToken: req.csrfToken() })
        res.render('video/upload', {
          csrfToken: req.csrfToken()
        })
      }
    })

    // saves video to DB with upload.single-function
    .post(csrfProtection, upload.single('video'), async (req, res) => {
      if (req.session.username) {
        // saves video info in separate mongoose model
        const video = new Video({
          fileName: req.file.filename,
          title: req.body.title,
          description: req.body.description,
          createdBy: req.session.username,
          creatorId: req.session.userid
        })
        await video.save()

        if (req.file) {
          req.session.flash = {
            type: 'success',
            text: 'The Video has been succesfully uploaded!'
          }
          res.status(201)
          res.redirect(`/play/${req.file.filename}`)
        } else {
          req.session.flash = {
            type: 'error',
            text: 'The Video upload failed.'
          }
          res.status(500)
          res.redirect('/upload')
        }
      } else {
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
