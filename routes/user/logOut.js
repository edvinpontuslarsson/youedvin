/**
 * Log out route
 */

'use strict'

const router = require('express').Router()

// Renders log out page
// Non-logged in users cannot access this page
router.route('/logout')
  .get((req, res) => {
    if (!req.session.username) {
      res.status(403)
      res.render('error/403')
    } else {
      res.render('user/logout')
    }
  })

  // destroys the session
  .post((req, res) => {
    req.session.destroy()

    res.status(303)
    res.redirect('/')
  })

module.exports = router
