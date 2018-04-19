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
      const videoInfo = await getSomeVideoInfo(req, res, 25, 0)

      if (!knownUser) {
        // should probably map here and then send in
        res.status(200)
        return res.render('home/index', {
          videoInfo
        })
      } else {
        res.status(200)
        return res.render('home/index', {
          knownUser, videoInfo
        })
      }
    })

// should have below in VideoLib for consistency

/**
 * Gets Video info, can limit
 * @param {*} req - request
 * @param {*} res - response
 * @param {number} limit - amount to limit
 * @param {number} skip - amount to skip
 */
async function getSomeVideoInfo (req, res, limit, skip) {
  try {
    const videoInfo = await VideoInfo.find({}).sort({
      createdAt: 'descending'
    }).limit(limit).skip(skip).exec()
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
