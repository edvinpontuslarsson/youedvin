/**
 * Route for changing password
 */

'use strict'

const router = require('express').Router()
const User = require('../../models/User')

router.route('/passedit/:id')

  // renders form
  .get((req, res) => {
    const userid = req.params.id
    User.findById(userid,
      (error, user) => {
        // server error
        if (error) { throw error }

        // id in session === string, id in DB === object
        if (req.session.userid != user._id) {
          res.status(403)
          res.render('error/403')
        } else {
          res.render('user/passedit', {
            username: user.username,
            id: userid
          })
        }
      })
  })

  // handles post
  .post(async (req, res) => {
    const newPass = req.body.newPass
    const confirmPass = req.body.confirmPass
    const currentPass = req.body.currentPass
    const userid = req.params.id

    User.findById(userid,
      (error, user) => {
        // server error
        if (error) { throw error }

        // id in session === string, id in DB === object
        if (userid != user._id) {
          res.status(403)
          res.render('error/403')
        } else {
          // non-existing user
          if (!user) {
            res.status(500)
            res.render('error/500')
          } else {
            // non-matching passwords
            if (newPass !== confirmPass) {
              req.session.flash = {
                type: 'error',
                text: 'Password confirmation does not match new password'
              }
              res.status(401)
              res.redirect(`/passedit/${userid}`)
            } else {
              // uses bcrypt comparePassword function
              user.comparePassword(currentPass, async (err, result) => {
                // server error
                if (err) { throw err }

                // incorrect current password
                if (!result) {
                  req.session.flash = {
                    type: 'error',
                    text: 'Incorrect current password'
                  }
                  res.status(401)
                  res.redirect(`/passedit/${userid}`)
                } else {
                  // the new password gets salted and hashed
                  // then saved to DB
                  try {
                    user.password = newPass

                    await user.save()

                    req.session.flash = {
                      type: 'success',
                      text: 'Password has been succesfully changed'
                    }
                    res.status(201)
                    res.redirect('/')
                  } catch (e) {
                    req.session.flash = {
                      type: 'error',
                      text: 'Something went wrong'
                    }
                    res.status(500)
                    res.redirect(`/passedit/${userid}`)
                  }
                }
              })
            }
          }
        }
      })
  })

module.exports = router
