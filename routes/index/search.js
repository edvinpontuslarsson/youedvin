'use strict'

const router = require('express').Router()
const Lib = require('../../lib/Lib')

// limit of videolinks to be displayed per page
const limit = 2

// query for 1 more than to be displayed,
// to check if new page is needed
const query = limit + 1

/**
 * First page of search results
 */
router.route('/search')
    .get(async (req, res) => {
        const videoArr = []
        const addPage = false

        res.status(200)
        res.render('home/index', {
            videoArr, addPage, nextPage: 2
        })
    })

module.exports = router
