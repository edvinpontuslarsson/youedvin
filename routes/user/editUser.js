'use strict'

const router = require('express').Router()
const User = require('../../models/User')
const csrf = require('csurf')

const csrfProtection = csrf()

// start with just enabling username change

router.route('/edituser/:id')
    .get(csrfProtection, (req, res) => {
        const userId = req.params.id
        const user = User.findById({
            userId
        }, (error, user) => {
        // server error
        if (error) { throw error }

            
        }
        )
    })

module.exports = router
