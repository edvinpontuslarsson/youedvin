/**
 * Surprise route
 */

'use strict'

const router = require('express').Router()
const VideoAmount = require('../../models/VideoAmount')
const Lib = require('../../lib/Lib')


router.route('/surprise')

// Redirects to random video
.get(async (req, res) => {
  const videoAmount = await VideoAmount.findOne({
    name: 'VideoAmount'
  })

  if (!videoAmount) {
    return res.render('error/404')
  }

  const amount = videoAmount.amount
  const skip = Lib.make.randomInteger(0, amount)

  // selects a random video by skipping a random amount
  const randomVideo = await Lib.get.newestVideos(1, skip)

  if (!randomVideo[0]) {
    return res.render('error/404')
  }

  res.redirect(`/play/${randomVideo[0].fileName}`)
})

module.exports = router
