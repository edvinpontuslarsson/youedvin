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
const multer = require('multer')
const Storage = require('../../models/GridFsStorage')

const upload = multer({ Storage })

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

    // saves video to DB with upload.single-function
    .post(csrfProtection, upload.single('video'), async (req, res) => {
      if (req.session.username) {
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
      // if the user isn't logged in
    } else {
        res.status(403)
        res.render('error/403')
      }
    })

module.exports = router
