/**
 * Route for uploading video files
 */

'use strict'

const router = require('express').Router()
const VideoInfo = require('../../models/VideoInfo')
const VideoAmount = require('../../models/VideoAmount')
const path = require('path')
const Lib = require('../../lib/Lib')
const multer = require('multer')
const GridFsStorage = require('multer-gridfs-storage')
const fileType = require('file-type')

// https://medium.com/the-everyday-developer/detect-file-mime-type-using-magic-numbers-and-javascript-16bc513d4e1e

// Defines storage of files with validation
const storage = new GridFsStorage({
  url: process.env.dbURL,
  file: (req, file) => {
    const data = []

    req.on('data', chunk => {
      data.push(chunk)
      const test = fileType(chunk)
      console.log(test)
    })

    req.on('end', () => {
      return new Promise((resolve, reject) => {
        const buffer = Buffer.concat(data)
        console.log(buffer)

        const fType = fileType(buffer)
        console.log(fType)

        if (fType === null) {
          return reject(new Error('Unsupported file format'))
        }

        if (
          fType.mime !== 'video/mp4' ||
          fType.mime !== 'video/webm' ||
          fType.mime !== 'video/ogg'
        ) {
          return reject(new Error('Unsupported file format'))
        }

        if (!req.session.username) {
          return reject(new Error('Unauthorized file upload attempt'))
        }

        // changes the file name before storing
        const fileName =
          Lib.make.randomString() + path.extname(file.originalname)
        const fileInfo = {
          filename: fileName,
          bucketName: 'uploads'
        }
        resolve(fileInfo)
      })
    })
  }
})
const upload = multer({ storage })

router
  .route('/upload')

  .get((req, res) => {
    if (!req.session.username) {
      res.status(403)
      res.render('error/403')
    } else {
      // renders upload form
      res.render('video/upload')
    }
  })

  // saves video to DB with upload.single-function
  .post(upload.single('video'), async (req, res) => {
    console.log(req.file.filename)
    if (!req.session.username) {
      res.status(403)
      res.render('error/403')
    } else {
      // file gets saved to DB with upload.single-function
      // some other stuff happens here that aren't really relevant

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

module.exports = router
