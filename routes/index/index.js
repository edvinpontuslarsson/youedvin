/**
 * Route for index pages
 */

'use strict'

const router = require('express').Router()
const Lib = require('../../lib/Lib')

// limit of videolinks to be displayed per page
const limit = parseInt(process.env.pageLimit)

// query for 1 more than to be displayed,
// to check if new page is needed
const query = limit + 1

router.route('/')

  // Home page
  .get(async (req, res) => {
    const videoInfo = await
      Lib.get.newestVideos(query, 0)

    // add page or not
    const addPage = videoInfo.length > limit

    // array with info to display
    const videoArr = Lib.make.indexArr(videoInfo, limit)

    res.render('home/index', {
      videoArr, addPage, nextPage: limit
    })
  })

router.route('/count/:id')

  // For more pages
  .get(async (req, res) => {
    const currentPage = parseInt(req.params.id)

    if (isNaN(currentPage)) {
      res.status(404)
      return res.render('error/404')
    }

    const prevPage = currentPage - 1
    let nextPage = currentPage + 1

    const skip = prevPage * limit

    const videoInfo = await
      Lib.get.newestVideos(query, skip)

    if (videoInfo.length <= limit) {
      nextPage = false
    }

    if (videoInfo.length < 1) {
      res.status(404)
      res.render('error/404')
    } else {
      const videoArr = Lib.make.indexArr(videoInfo, limit)

      res.render('home/index', {
        videoArr, addPage: true, prevPage, nextPage
      })
    }
  })

module.exports = router
