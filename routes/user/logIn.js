/**
 * Log in route
 */

'use strict'

const router = require('express').Router()
const sanitize = require('mongo-sanitize')
const User = require('../../models/User')

router.route('/login')

  // renders log in form
  .get((req, res) => {
    res.render('user/login')
  })

  // validates username & password
  .post((req, res) => {
    const username = sanitize(req.body.username)
    const password = sanitize(req.body.password)

    User.findOne({
      username: username
    }, (error, user) => {
      // server error
      if (error) { throw error }

      // non-existing username
      if (!user) {
        req.session.flash = {
          type: 'error',
          text: 'Incorrect login info'
        }
        res.status(401)
        res.redirect('/login')
      } else {
        // uses bcrypt comparePassword function
        user.comparePassword(password, (err, result) => {
          // server error
          if (err) { throw err }

          // incorrect password
          if (result === false) {
            req.session.flash = {
              type: 'error',
              text: 'Incorrect login info'
            }
            res.status(401)
            res.redirect('/login')
          } else {
            // saves the username and id in session
            req.session.username = user.username
            req.session.userid = user._id

            req.session.flash = {
              type: 'success',
              text: 'You are now logged in!'
            }

            res.status(303)
            res.redirect('/')
          }
        })
      }
    })
  })

module.exports = router
