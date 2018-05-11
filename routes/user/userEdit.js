'use strict'

const router = require('express').Router()
const User = require('../../models/User')
const csrf = require('csurf')

const csrfProtection = csrf()

// start with just enabling username change

router.route('/useredit/:id')
    .get(csrfProtection, (req, res) => {
        const userId = req.params.id
        const user = User.findById({
            userId
        }, (error, user) => {
        // server error
        if (error) { throw error }

        if (req.session.userid !== user._id)
        {
            res.status(403)
            res.render('error/403')

        // if everything is OK
        } else {
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
