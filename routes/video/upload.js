/**
 * Route for uploading video files
 */

'use strict'

const router = require('express').Router()
const VideoInfo = require('../../models/VideoInfo')
const VideoAmount = require('../../models/VideoAmount')
const fs = require('fs')
const path = require('path')
const Lib = require('../../lib/Lib')
const multer = require('multer')
const fileType = require('file-type')

// https://www.manthanhd.com/2016/06/26/handling-file-uploads-in-express/
// https://stackoverflow.com/questions/45805890/node-multer-memory-storage-how-to-release-memory

/**
 * Sets up multer file system storage, changes the name of the file
 * Inspired by a method described here: https://www.youtube.com/watch?v=9Qzmri1WaaE&index=3&list=LLwTR7eKKJwFR5fxi_wzqzww&t=0s
 */
const storage = multer.diskStorage({
  destination: './public/videoUploads',
  filename: (req, file, cB) => {
    cB(null, Lib.make.randomString() +
      path.extname(file.originalname))
  }
})

// Sets up upload function with storage defined above
const upload = multer({
  storage: storage,
  /**
   * checks mimetype of file, 
   * more thorough file-type inspection executes
   * when file is in file system
   */
  fileFilter: (req, file, cB) => {
    Lib.validate.mimeType(file, cB)
  }
}).single('video')

router.route('/upload')

  // for rendering upload form
  .get((req, res) => {
    if (!req.session.username) {
      res.status(403)
      res.render('error/403')
    } else {
      res.render('video/upload')
    }
  })

  // for video storage
  .post(async (req, res) => {
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

          // more thorough file validation here, remove if mp4 for example

          // saves video info in separate mongoose model
          const videoInfo = new VideoInfo({
            fileName: req.file.filename,
            contentType: req.file.mimetype,
            title: req.body.title,
            description: req.body.description,
            createdBy: req.session.username,
            creatorId: req.session.userid
          })
          await videoInfo.save()

          // to update video amount
          const videoAmount = await VideoAmount.findOne({
            name: 'VideoAmount'
          })

          if (videoAmount) {
            videoAmount.amount += 1
            await videoAmount.save()
          } else {
            const newVideoAmount = new VideoAmount()
            newVideoAmount.amount += 1
            await newVideoAmount.save()
          }

          req.session.flash = {
            type: 'success',
            text: 'The Video has been succesfully uploaded!'
          }
          res.status(201)
          res.redirect(`/play/${req.file.filename}`)
        }
      })
    }
  })

module.exports = router
