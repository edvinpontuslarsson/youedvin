const router = require('express').Router()
const Video = require('../../models/Video')
const Lib = require('../../lib/Lib')
const lib = new Lib()
const csrf = require('csurf')

// to set up csurf protection
const csrfProtection = csrf()

router.route('/delete/:id')
// checks that the user is the creator of the Video
// then renders the page for choosing to delete the Video
    .get(csrfProtection, async (req, res) => {
      const video = await lib.getVideoInfoBycreatorId(req.params.id)

      if (video.creatorId !== req.session.userid) {
        res.status(403)
        res.render('error/403')
      } else {
        res.render('video/delete', {csrfToken: req.csrfToken(), id: req.params.id})
      }
    })

// have to delete both model and video info

    .post(csrfProtection, async (req, res) => {
      const video = await lib.getVideoInfoBycreatorId(req.params.id)

      if (video.creatorId !== req.session.userid) {
        res.status(403)
        res.render('error/403')
      } else {
        await Video.findOneAndRemove({
          creatorId: req.params.id
        })
            req.session.flash = {
                type: 'success',
                text: 'The Snippet has been succesfully deleted.'
              }
              res.redirect('/')
      }
    })

module.exports = router
