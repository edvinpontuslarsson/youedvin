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
        let knownUser = req.session.username

        if (!knownUser) {
            return res.render('home/index')
        } else {
            return res.render('home/index', { knownUser })
        }        
    })

module.exports = router
