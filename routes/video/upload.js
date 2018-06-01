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

const fileInMemory = multer({
  storage: multer.memoryStorage()
})

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
  .post(fileInMemory.single('video'), async (req, res) => {
    if (!req.session.username) {
      res.status(403)
      res.render('error/403')
    } else {
      const videoFile = req.file
      const buffer = videoFile.buffer

      const fType = fileType(buffer)
      console.log(fType)

      // './public/videoUploads'

      // Lib.make.randomString() +
      // path.extname(file.originalname)
        /*
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
        }*/

        req.session.flash = {
          type: 'success',
          text: 'The Video has been succesfully uploaded!'
        }
        res.status(201)
        res.redirect('/')
        //res.redirect(`/play/${req.file.filename}`)
    }
  })

module.exports = router
