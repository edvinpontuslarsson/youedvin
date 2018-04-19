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
      const videodArr = []

      for (let i = videoInfo.length - 1; i >= 0; i -= 1) {
        videodArr.push(videoInfo[i])
      }

      if (!knownUser) {
        // should probably map here and then send in
        res.status(200)
        return res.render('home/index', { videodArr })
      } else {
        res.status(200)
        return res.render('home/index', { knownUser, videodArr })
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
