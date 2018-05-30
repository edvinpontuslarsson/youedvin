/**
 * Account settings route
 */

'use strict'

const router = require('express').Router()
const User = require('../../models/User')

// renders account settings page for authenticated user
router.route('/useredit/:id')
  .get((req, res) => {
    const username = req.params.id
    User.findOne({
      username: username
    }, (error, user) => {
      // server error
      if (error) { throw error }

      // id in session === string, id in DB === object
      if (req.session.userid != user._id) {
        res.status(403)
        res.render('error/403')
      } else {
        res.render('user/userEdit', {
          username: user.username,
          id: user._id
        })
      }
    })
  })

module.exports = router
