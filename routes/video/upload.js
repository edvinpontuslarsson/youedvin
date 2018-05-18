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

const csrf = require('csurf')
const csrfProtection = csrf()

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
  .post(csrfProtection, async (req, res) => {
    if (!req.session.username) {
      res.status(403)
      res.render('error/403')
    } else {
      // saves to file system & gets filename
      const fileName = await Lib.save.file(req)      
      const publicPath = `/videos/${fileName}` 

      // make thumbnail, call lib func

      // saves video info to DB
      const videoInfo = new VideoInfo({
        fileName: fileName,
        filePath: publicPath,
        contentType: videoFile.mimetype,
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
      res.redirect(`/play/${req.file.filename}`)
    }
  })

module.exports = router
