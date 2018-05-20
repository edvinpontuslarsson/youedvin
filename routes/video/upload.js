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
      if (!req.files) {
        req.session.flash = {
          type: 'error',
          text: 'No file submitted'
        }
        res.status(400)
        return res.redirect('/upload')
      }

      // check if limit exceeded

      const videoFile = req.files.video
      const oldName = videoFile.name

      if (!Lib.validate.extName(oldName)) {
        req.session.flash = {
          type: 'error',
          text: 'Unsupported file format'
        }
        res.status(400)
        return res.redirect('/upload')
      }

      const newName = `${Lib.make.randomString()}${path.extname(oldName)}`

      videoFile.name = newName

      // maybe it could be string templating that mess things up?

      // const publicPath = `/videos/${videoFile.name}`
      const savePath = `./tempUploads/${videoFile.name}`

      // perhaps have below in separate promise wrapper

      videoFile.mv(savePath, async (error) => {
        if (error) {
          console.log(error)
          req.session.flash = {
            type: 'error',
            text: 'Upload failed'
          }
          res.status(500)
          return res.redirect('/upload')
        }

        // make thumbnail, call lib func

        // saves video info to DB
        const videoInfo = new VideoInfo({
          fileName: videoFile.name,
          // publicPath: publicPath,
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
        })
    }
  })

module.exports = router
