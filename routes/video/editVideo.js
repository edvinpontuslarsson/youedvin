/**
 * Edit video route
 */

'use strict'

const router = require('express').Router()
const VideoInfo = require('../../models/VideoInfo')
const sanitize = require('mongo-sanitize')
const Lib = require('../../lib/Lib')

router.route('/editvideo/:id')

  // renders edit video form for authenticated user
  .get(async (req, res) => {
    const fileName = sanitize(req.params.id)
    const videoInfo = await Lib.get.aVideo(fileName)

    if (videoInfo === null) {
      res.status(404)
      return res.render('error/404')
    }

    if (videoInfo.creatorId !== req.session.userid) {
      res.status(403)
      res.render('error/403')
    } else {
      res.render('video/edit', {
        id: fileName,
        title: videoInfo.title,
        description: videoInfo.description
      })
    }
  })

  .post(async (req, res) => {
    const fileName = sanitize(req.params.id)
    const videoInfo = await Lib.get.aVideo(fileName)

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
          title: sanitize(req.body.title),
          description: sanitize(req.body.description)
        },

        { new: true },

        // if server error occurs
        (err) => {
          if (err) {
            req.session.flash = {
              type: 'error',
              text: 'Something went wrong'
            }
            return res.redirect(`/edit/${fileName}`)
          }

          // if everything goes well
          req.session.flash = {
            type: 'success',
            text: 'Video info has been succesfully updated!'
          }

          res.redirect(`/play/${fileName}`)
        })
    }
  })

module.exports = router
