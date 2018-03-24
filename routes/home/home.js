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

router.route('/')
    .get(async (req, res) => {
        return res.render('home/index')
    })

module.exports = router
