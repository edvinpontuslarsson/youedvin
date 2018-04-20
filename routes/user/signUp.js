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
const UserLib = require('../../lib/UserLib')
const userLib = new UserLib()
const csrf = require('csurf')

const csrfProtection = csrf()

router.route('/signup')
    /**
     * Renders sign up page
     */
    .get(csrfProtection, (req, res) => {
      res.status(200)
      res.header({ csrfToken: req.csrfToken() })
      res.render('user/signup', {
        csrfToken: req.csrfToken()
      })
    })

    /**
     * Validates username and passwords
     * Saves user information to DB
     */
    .post(csrfProtection, async (req, res) => {
      const username = req.body.username
      const password = req.body.password
      const confirmPassword = req.body.confirmPassword

      // searches DB for the username
      const ifAlreadyExists = await User.findOne({
        username: username
      }, (error) => {
        if (error) {
          req.session.flash = {
            type: 'error',
            text: 'Something went wrong'
          }
          res.status(500)
          res.redirect('/signup')
        }
      })

      // calls validation function in UserLib
      const validation = userLib.signUpValidation(username, password, confirmPassword, ifAlreadyExists)

      if (validation.okay === false) {
        req.session.flash = {
          type: 'error',
          text: validation.message
        }
        res.status(validation.status)
        res.redirect('/signup')
      }

      if (validation.okay === true) {
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

          res.status(201)
          res.redirect('/login')
        } catch (error) {
          req.session.flash = {
            type: 'error',
            text: 'Something went wrong'
          }
          res.status(500)
          res.redirect('/signup')
        }
      }
    })

module.exports = router
