/**
 * Search route.
 */

'use strict'

const router = require('express').Router()
const xssFilters = require('xss-filters')
const sanitize = require('mongo-sanitize')
const Lib = require('../../lib/Lib')

router.route('/search')

  // Searches for query & displays result
  .get(async (req, res) => {
    const queryInput = req.query.search
    const queryString = sanitize(xssFilters.inHTMLData(queryInput))
    const videoInfo = await Lib.get.videosByTitle(queryString)

    // matches found or not
    const emptySearch = videoInfo.length < 1

    // array with info to display
    const videoArr = Lib.make.indexArr(videoInfo)

    res.render('home/index', {
      videoArr, emptySearch
    })
  })

module.exports = router
