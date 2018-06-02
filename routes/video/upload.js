/**
 * Route for uploading video files
 */

'use strict'

const router = require('express').Router()
const VideoInfo = require('../../models/VideoInfo')
const VideoAmount = require('../../models/VideoAmount')
const fsDAO = require('../../models/fsDAO')
const path = require('path')
const Lib = require('../../lib/Lib')
const fileType = require('file-type')

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
      const fileContent = req.files.video
      const buffer = fileContent.data
      const fType = fileType(buffer)

      // validates the file format
      if (!path.extname(fileContent.name) ||
        !Lib.validate.mimeType(fType.mime)) {
        req.session.flash = {
          type: 'error',
          text: 'Unsupported file format'
        }
        res.status(400)
        res.redirect('/upload')
      } else {
        const fileName = Lib.make.randomString() +
            path.extname(fileContent.name)

        const filePath = `./public/uploads/videos/${fileName}`

        // saves file to fs
        await fsDAO.putFile(filePath, buffer)

        const thumbnailDir = './public/uploads/thumbnails/'

        // Generates and saves thumbnail
        await Lib.make.thumbnail(filePath, thumbnailDir)

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
        res.redirect(`/play/${fileName}`) 
      }
    }
  })

module.exports = router
