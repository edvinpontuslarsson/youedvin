/**
 * @module upload
 * @author Edvin Larsson
 * 
 * Route for uploading videos
 * 
 * @requires express
 * @requires Video
 * @requires csurf
 */

'use strict'

const router = require('express').Router()
const csrf = require('csurf')
const csrfProtection = csrf()

router.route('/upload')
    // renders upload form, only for logged in users
    .get(csrfProtection, (req, res) => {
        if (!req.session.username) {
            res.status(403)
            res.render('error/403')
        } else {
            res.render('video/upload', {
                csrfToken: req.csrfToken()
            })
        }
    })

module.exports = router
