'use strict'

const router = require('express').Router()
const Lib = require('../../lib/Lib')

/**
 * Displays search results
 */
router.route('/search')
  .get(async (req, res) => {
    const queryString = req.query.search
    const videoInfo = await Lib.get.videosByTitle(queryString)

    const emptySearch = true ? videoInfo.length < 1 : false

    const videoArr = Lib.make.indexArr(videoInfo)

    res.status(200)
    res.render('home/index', {
      videoArr, emptySearch
    })
  })

module.exports = router
