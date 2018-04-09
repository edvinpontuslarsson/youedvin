/**
 * @module home.js
 * @author Edvin Larsson
 *
 * Route for the home page
 *
 * @requires express
 * @requires Snippet
 */

'use strict'

const router = require('express').Router()
const Video = require('../../models/Video')

router.route('/')
    .get(async (req, res) => {
      const knownUser = req.session.username
      const video = await getAllVideoInfo(req, res)

      for (let i = 0; i < video.length; i += 1) {
        if (knownUser === video[i].createdBy) {
          video[i].canEdit = true
        }
      }

      if (!knownUser) {
        // should probably map here and then send in
        return res.render('home/index', { video })
      } else {
        return res.render('home/index', { knownUser, video })
      }
    })

/**
 * Gets Video info
 * @param {*} req - request
 * @param {*} res - response
 */
async function getAllVideoInfo (req, res) {
  try {
    const video = await Video.find({}).exec()
    return video
  } catch (error) {
    req.session.flash = {
      type: 'error',
      text: 'Something went wrong'
    }
    res.redirect('/')
  }
}

module.exports = router
