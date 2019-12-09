/**
 * User registration route
 */

'use strict'

const router = require('express').Router()
const User = require('../../models/User')
const sanitize = require('mongo-sanitize')
const Lib = require('../../lib/Lib')

router.route('/signup')

  // Renders sign up form
  .get((req, res) => {
    res.render('user/signup')
  })

  /**
   * Validates username and passwords
   * Saves user info to DB
   */
  .post(async (req, res) => {
    const cleanBody = sanitize(req.body)
    const username = cleanBody.username
    const password = cleanBody.password
    const confirmPassword = cleanBody.confirmPassword

    // searches DB for username
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

    // uses lib function to validate input
    const validation = Lib.validate.registration(username, password, confirmPassword, ifAlreadyExists)

    if (!validation.okay) {
      req.session.flash = {
        type: 'error',
        text: validation.message
      }
      res.status(validation.status)
      return res.redirect('/signup')
    }

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
  })

module.exports = router
