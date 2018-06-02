/**
 * Route for uploading video files
 */

'use strict'

const router = require('express').Router()
const VideoInfo = require('../../models/VideoInfo')
const fsDAO = require('../../models/fsDAO')
const path = require('path')
const Lib = require('../../lib/Lib')
const multer = require('multer')
const fileType = require('file-type')

// sets up memory storage
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
      const fileContent = req.file
      const buffer = fileContent.buffer
      const fType = fileType(buffer)

      // validates the file format
      if (!path.extname(fileContent.originalname) ||
        !Lib.validate.mimeType(fType.mime)) {
          req.session.flash = {
            type: 'error',
            text: 'Unsupported file format'
          }
          res.status(400)
          res.redirect('/upload')
        } else {
          const fileName = Lib.make.randomString() +
            path.extname(fileContent.originalname)

          const filePath = `./uploads/videos/${fileName}`

          // saves file to fs
          await fsDAO.putFile(filePath, buffer)

          const videoAmountPath =
            './uploads/videoAmount.json'

          // gets total video amount to update
          const jsonVAmount = 
            await fsDAO.getFile(videoAmountPath)
          const videoAmount = JSON.parse(jsonVAmount)
          videoAmount.count += 1

          const update = JSON.stringify(videoAmount)
          await fsDAO.putFile(videoAmountPath, update)
          
          // saves video info in separate mongoose model
          const videoInfo = new VideoInfo({
            fileName: fileName,
            contentType: fType.mime,
            title: req.body.title,
            description: req.body.description,
            createdBy: req.session.username,
            creatorId: req.session.userid
          })
          await videoInfo.save()

          req.session.flash = {
            type: 'success',
            text: 'The Video has been succesfully uploaded!'
          }
          res.status(201)
          res.redirect(`/play/${fileName}`)
        }
    }
  })

module.exports = router
