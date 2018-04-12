/**
 * @module logOut.js
 * @author Edvin Larsson
 *
 * Route for the loging out
 *
 * @requires express
 * @requires csurf
 */

'use strict'

const router = require('express').Router()
const csrf = require('csurf')

const csrfProtection = csrf()

// Renders log out page
// Non-logged in users cannot access this page
router.route('/logout')
    .get(csrfProtection, (req, res) => {
      if (!req.session.username) {
        res.status(403)
        res.render('error/403')
      } else {
        res.status(200)
        res.header({ csrfToken: req.csrfToken() })
        res.render('user/logout', {
          csrfToken: req.csrfToken()
        })
      }
    })
    // destroys the session
    .post(csrfProtection, (req, res) => {
      req.session.destroy()

      res.status(303)
      res.redirect('/')
    })

module.exports = router
