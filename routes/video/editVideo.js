'use strict'

const router = require('express').Router()
const mongoose = require('mongoose')
const VideoInfo = require('../../models/VideoInfo')
const Lib = require('../../lib/Lib')
const csrf = require('csurf')

// to set up csurf protection
const csrfProtection = csrf()

router.route('/editvideo/:id')
// checks that the user is the creator of the Video
// then renders the page for choosing to edit Video Info
  .get(csrfProtection, async (req, res) => {
    const videoInfo = await Lib.get.aVideo(req.params.id)

    if (videoInfo === null) {
      res.status(404)
      return res.render('error/404')
    }

    if (videoInfo.creatorId !== req.session.userid) {
      res.status(403)
      res.render('error/403')

      // if everything is OK
    } else {
      res.status(200)
      res.header({ csrfToken: req.csrfToken() })
      res.render('video/edit', {
        csrfToken: req.csrfToken(),
        id: req.params.id,
        title: videoInfo.title,
        description: videoInfo.description
      })
    }
  })

// to update video info
// inspired by method used here: https://coursework.vschool.io/mongoose-crud/
  .post(csrfProtection, async (req, res) => {
    const videoInfo = await Lib.get.aVideo(req.params.id)

    if (videoInfo.creatorId !== req.session.userid) {
      res.status(403)
      res.render('error/403')
    } else {
      res.status(200)

      const query = videoInfo._id

      VideoInfo.findByIdAndUpdate(
        query,

        // updated data
        {
          title: req.body.title,
          description: req.body.description
        },
        { new: true},

        // if error occurs
        (err) => {
          if (err) {
            req.session.flash = {
              type: 'error',
              text: 'Something went wrong'
            }
            res.redirect(`/edit/${req.params.id}`)
          }

          // if everything goes well
          req.session.flash = {
            type: 'success',
            text: 'Video info has been succesfully updated!'
          }

          res.redirect(`/play/${req.params.id}`)
        }
      )
    }
  })

module.exports = router
