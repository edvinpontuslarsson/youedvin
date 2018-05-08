'use strict'

const router = require('express').Router()

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
