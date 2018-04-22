/**
 * @module logIn.js
 * @author Edvin Larsson
 *
 * Route for the loging in
 *
 * @requires express
 * @requires User
 * @requires csurf
 */

'use strict'

const router = require('express').Router()
const User = require('../../models/User')
const csrf = require('csurf')

const csrfProtection = csrf()

router.route('/login')
    // renders log in page
    .get(csrfProtection, (req, res) => {
      res.status(200)
      res.header({ csrfToken: req.csrfToken() })
      res.render('user/login', {
        csrfToken: req.csrfToken()
      })
    })
    
    // checks for existing user and if the password is correct
    .post(csrfProtection, (req, res) => {
      const username = req.body.username
      const password = req.body.password

      User.findOne({
        username: username
      }, (error, user) => {
        // server error
        if (error) {
          req.session.flash = {
            type: 'error',
            text: 'Something went wrong'
          }
          res.status(500)
          res.redirect('/login')
        }
        // non-existing username
        if (!user) {
          req.session.flash = {
            type: 'error',
            text: 'Incorrect login info'
          }
          res.status(401)
          res.redirect('/login')
        } else {
          // uses bcrypt compare function
          user.comparePassword(password, (err, result) => {
            // server error
            if (err) {
              req.session.flash = {
                type: 'error',
                text: 'Something went wrong'
              }
              res.status(500)
              res.redirect('/login')
            }
            // wrong password
            if (result === false) {
              req.session.flash = {
                type: 'error',
                text: 'Incorrect login info'
              }
              res.status(401)
              res.redirect('/login')
            } else {
              // saves the username and id in cookie
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
