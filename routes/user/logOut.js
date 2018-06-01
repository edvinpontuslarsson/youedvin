/**
 * Log out route
 */

'use strict'

const router = require('express').Router()

router.route('/logout')

  // Renders log out page
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
