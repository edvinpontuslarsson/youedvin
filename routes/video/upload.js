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
const VideoInfo = require('../../models/VideoInfo')
const VideoAmount = require('../../models/VideoAmount')
const path = require('path')
const Lib = require('../../lib/Lib')
const multer = require('multer')
const GridFsStorage = require('multer-gridfs-storage')

const csrf = require('csurf')
const csrfProtection = csrf()

/**
 * Defines storage of files with validation
 */
const storage = new GridFsStorage({
  url: process.env.dbURL,
  file: (req, file) => {
    return new Promise((resolve, reject) => {

      // see the error handling in the app-module for how these errors are handled
      if (Lib.validate.extName(file.originalname) === false) {
        return reject(new Error('Upload attempt with unsupported file format'))
      } else if (!req.session.username) {
        return reject(new Error('Unauthorized file upload attempt'))

        // changes the file name before storing
      } else {
        const fileName = Lib.make.randomString() + path.extname(file.originalname)
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
        res.status(200)
        res.header({ csrfToken: req.csrfToken() })
        res.render('video/upload', {
          csrfToken: req.csrfToken()
        })
      }
    })   

    /**
     * saves video to DB with upload.single-function
     * validation that the uploader is logged in, also takes place
     * in that function
     */
    .post(csrfProtection, upload.single('video'), async (req, res) => {
        // saves video info in separate mongoose model
        const videoInfo = new VideoInfo({
          fileName: req.file.filename,
          contentType: req.file.contentType,
          title: req.body.title,
          description: req.body.description,
          createdBy: req.session.username,
          creatorId: req.session.userid
        })
        await videoInfo.save()

        // updates video amount
        const videoAmount = new VideoAmount({
          amount: + 1
        })
        await videoAmount.save()

        req.session.flash = {
          type: 'success',
          text: 'The Video has been succesfully uploaded!'
        }
        res.status(201)
        res.redirect(`/play/${req.file.filename}`)
    })

module.exports = router
