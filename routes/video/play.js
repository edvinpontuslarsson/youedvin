/**
 * Play video route
 */

'use strict'

const router = require('express').Router()
const Lib = require('../../lib/Lib')

router.route('/play/:id')

  // Renders the video to be played
  .get(async (req, res) => {
    const fileName = req.params.id

    const videoInfo = await Lib.get.aVideo(fileName)

    if (videoInfo === null) {
      res.status(404)
      res.render('error/404')
    } else {
      if (videoInfo.createdBy === req.session.username) {
        videoInfo.canEdit = true
      }

      res.render('video/play', {
        videoInfo
      })
    }
  })

module.exports = router
