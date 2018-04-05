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
      const video = await getVideoInfo(req, res)
      console.log(video)

      if (!knownUser) {
        return res.render('home/index')
      } else {
        return res.render('home/index', { knownUser })
      }
    })

/**
 * Gets Video info
 * @param {*} req - request
 * @param {*} res - response
 */
async function getVideoInfo (req, res) {
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
