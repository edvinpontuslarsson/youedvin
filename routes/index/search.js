/**
 * Search route
 */

'use strict'

const router = require('express').Router()
const Lib = require('../../lib/Lib')

// Searches for query & displays result
router.route('/search')
  .get(async (req, res) => {
    const queryString = req.query.search
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
