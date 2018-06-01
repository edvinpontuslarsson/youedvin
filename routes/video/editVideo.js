/**
 * Edit video route
 */

'use strict'

const router = require('express').Router()
const VideoInfo = require('../../models/VideoInfo')
const Lib = require('../../lib/Lib')

router.route('/editvideo/:id')
  
  // renders edit video form for authenticated user
  .get(async (req, res) => {
    const videoInfo = await Lib.get.aVideo(req.params.id)

    if (videoInfo === null) {
      res.status(404)
      return res.render('error/404')
    }

    if (videoInfo.creatorId !== req.session.userid) {
      res.status(403)
      res.render('error/403')
    } else {
      res.render('video/edit', {
        id: req.params.id,
        title: videoInfo.title,
        description: videoInfo.description
      })
    }
  })

  .post(async (req, res) => {
    const videoInfo = await Lib.get.aVideo(req.params.id)

    if (videoInfo.creatorId !== req.session.userid) {
      res.status(403)
      res.render('error/403')
    } else {
      const query = videoInfo._id

      // updates video info
      // inspired by method used here: https://coursework.vschool.io/mongoose-crud/
      VideoInfo.findByIdAndUpdate(
        query,

        // updated data
        {
          title: req.body.title,
          description: req.body.description
        },

        { new: true },

        // if server error occurs
        (err) => {
          if (err) {
            req.session.flash = {
              type: 'error',
              text: 'Something went wrong'
            }
            return res.redirect(`/edit/${req.params.id}`)
          }

          // if everything goes well
          req.session.flash = {
            type: 'success',
            text: 'Video info has been succesfully updated!'
          }

          res.redirect(`/play/${req.params.id}`)
        })
    }
  })

module.exports = router
