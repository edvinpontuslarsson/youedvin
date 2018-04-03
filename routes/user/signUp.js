/**
 * @module user
 * @author Edvin Larsson
 *
 * Route for signing up
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

router.route('/signup')
    /**
     * Renders sign up page
     */
    .get(csrfProtection, (req, res) => {
      res.render('user/signup', {
        csrfToken: req.csrfToken()
      })
    })

    /**
     * Validates username and passwords
     * Saves user information to DB
     */
    .post(csrfProtection, async (req, res, next) => {
      const username = req.body.username
      const password = req.body.password
      const confirmPassword = req.body.confirmPassword

      const ifAlreadyExists = await User.findOne({
        username: username
      }, (error) => {
        if (error) {
          req.session.flash = {
            type: 'error',
            text: 'Something went wrong'
          }
          res.redirect('/signup')
        }
      })

      if (password.length < 5) {
        req.session.flash = {
          type: 'error',
          text: 'The password needs to be at least 5 characters long'
        }
        res.redirect('/signup')
      } else if (password !== confirmPassword) {
        req.session.flash = {
          type: 'error',
          text: 'The passwords do not match'
        }
        res.redirect('/signup')
      } else if (ifAlreadyExists !== null) {
        req.session.flash = {
          type: 'error',
          text: 'The username is already taken, please choose a different one!'
        }
        res.redirect('/signup')
      } else {
              // the password gets salted and hashed
              // then the user is saved to DB
        try {
          const user = await new User({
            username: username,
            password: password
          })
          await user.save()
          req.session.flash = {
            type: 'success',
            text: `You are now a registered user, welcome aboard ${username}!`
          }

          res.redirect('/login')
        } catch (error) {
          req.session.flash = {
            type: 'error',
            text: 'Something went wrong'
          }
          res.redirect('/signup')
        }
      }
    })

module.exports = router
