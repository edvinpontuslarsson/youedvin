'use strict'

const router = require('express').Router()
const User = require('../../models/User')
const csrf = require('csurf')

const csrfProtection = csrf()

router.route('/useredit/:id')
    .get(csrfProtection, (req, res) => {
        const username = req.params.id
        const user = User.findOne({
            username: username
        }, (error, user) => {
        // server error
        if (error) { throw error }

        // id in session string, id in DB object
        if (req.session.userid != user._id) {
            res.status(403)
            res.render('error/403')
        } else {
            // if everything is OK
            res.status(200)
            res.header({ csrfToken: req.csrfToken() })
            res.render('user/userEdit', {
                username: user.username,
                id: user._id
            })
            }
        })
    })

module.exports = router
