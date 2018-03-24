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
      res.render('user/login', {
        csrfToken: req.csrfToken()
      })
    })
    // checks for existing user and if the password is correct
    .post(csrfProtection, (req, res, next) => {
      let username = req.body.username
      let password = req.body.password

      User.findOne({
        username: username
      }, (error, user) => {
        if (error) {
          req.session.flash = {
            type: 'error',
            text: 'Something went wrong'
          }
          res.redirect('/login')
        }
        if (!user) {
          req.session.flash = {
            type: 'error',
            text: 'Incorrect login info'
          }
          res.redirect('/login')
        } else {
          user.comparePassword(password, (err, result) => {
            if (err) {
              req.session.flash = {
                type: 'error',
                text: 'Something went wrong'
              }
              res.redirect('/login')
            }
            if (result === false) {
              req.session.flash = {
                type: 'error',
                text: 'Incorrect login info'
              }
              res.redirect('/login')
            } else {
              // saves the username and id in cookie
              req.session.username = user.username
              req.session.userid = user._id

              req.session.flash = {
                type: 'success',
                text: 'You are now logged in!'
              }

              res.redirect('/')
            }
          })
        }
      })
    })

module.exports = router
