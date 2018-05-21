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
const fs = require('fs')
const path = require('path')
const Lib = require('../../lib/Lib')
const multer = require('multer')

/**
 * Sets up multer file system storage, changes the name of the file
 * Inspired by a method described here: https://www.youtube.com/watch?v=9Qzmri1WaaE&index=3&list=LLwTR7eKKJwFR5fxi_wzqzww&t=0s
 */
const storage = multer.diskStorage({
  destination: '../../public/videos/',
  filename: (req, file, callback) => {
    callback(null, `${Lib.make.randomString()}${path.extname(file.originalname)}`)
  }
})

// Sets up upload function with storage defined above
const upload = multer({
  storage: storage
}).single('video')

const csrf = require('csurf')
const csrfProtection = csrf()

router.route('/upload')
// to render upload form
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

  // to save uploaded files in file system
  .post(csrfProtection, async (req, res) => {
    if (!req.session.username) {
      res.status(403)
      res.render('error/403')
    } else {
      upload(req, res, async (err) => {
        if (err) {
          req.session.flash = {
            type: 'error',
            text: 'Upload failed'
          }
          res.status(500)
          res.render('video/upload')
        } else {

          console.log(req.file)

        // make thumbnail, call lib func

        // const filePath = req.file.path

        // saves video info to DB
        const videoInfo = new VideoInfo({
          fileName: req.file.filename,
          contentType: req.file.mimetype,
          title: req.body.title,
          description: req.body.description,
          createdBy: req.session.username,
          creatorId: req.session.userid
        })
        await videoInfo.save()

        // updates video amount
        const videoAmount = new VideoAmount({
          amount: +1
        })
        await videoAmount.save()

        req.session.flash = {
          type: 'success',
          text: 'The Video has been succesfully uploaded!'
        }
        res.status(201)
        // temporarily just redirect to /
        res.redirect('/')
        // res.redirect(`/play/${req.file.filename}`)
        }
      })      
    }
  })

module.exports = router
