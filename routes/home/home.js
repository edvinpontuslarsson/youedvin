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
const mongoose = require('mongoose')

router.route('/')
    .get(async (req, res) => {
        const knownUser = req.session.username

        if (!knownUser) {
            return res.render('home/index')
        } else {
            return res.render('home/index', { knownUser })
        }        
    })

module.exports = router
