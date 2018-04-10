const router = require('express').Router()

router.route('/presignup')
    .get((req, res) => {
        res.status(200)
        res.render('user/preCookie')
    })
    
    .post((req, res) => {
        req.session.flash = {
            type: 'success',
            text: `Awesome, let's go!`
        }

        res.status(200)
        res.redirect('/signup')
    })

module.exports = router
