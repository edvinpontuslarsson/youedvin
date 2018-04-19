/**
 * @module home.js
 * @author Edvin Larsson
 *
 * Route for the home page
 *
 * @requires express
 */

'use strict'

const router = require('express').Router()
const VideoInfo = require('../../models/VideoInfo')

router.route('/')
    .get(async (req, res) => {
      const knownUser = req.session.username
      const videoInfo = await getAllVideoInfo(req, res)

      if (!knownUser) {
        // should probably map here and then send in
        res.status(200)
        return res.render('home/index', { videoInfo })
      } else {
        res.status(200)
        return res.render('home/index', { knownUser, videoInfo })
      }
    })

/**
 * Gets Video info
 * @param {*} req - request
 * @param {*} res - response
 */
async function getAllVideoInfo (req, res) {
  try {
    const videoInfo = await VideoInfo.find({}).exec()
    return videoInfo
  } catch (error) {
    req.session.flash = {
      type: 'error',
      text: 'Something went wrong'
    }
    res.status(500)
    res.redirect('/')
  }
}

module.exports = router
