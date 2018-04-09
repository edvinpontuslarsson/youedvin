const router = require('express').Router()
const mongoose = require('mongoose')
const Video = require('../../models/Video')
const Lib = require('../../lib/Lib')
const lib = new Lib()
const csrf = require('csurf')

// to set up csurf protection
const csrfProtection = csrf()

const connection = mongoose.connection
const Grid = require('gridfs-stream')
let gfs

/**
 * Connects gridfs-stream to the database
 * Inspired by: https://www.youtube.com/watch?v=3f5Q9wDePzY&t=2422s
 */
connection.once('open', () => {
  gfs = Grid(connection.db, mongoose.mongo)
  gfs.collection('uploads')
  console.log('Ready for deleting videos')
})

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
        // deletes video info
        await Video.findOneAndRemove({
          creatorId: req.params.id
        })

        // deletes the video file
        // inspired by method used here: https://www.youtube.com/watch?v=3f5Q9wDePzY&list=LLwTR7eKKJwFR5fxi_wzqzww&index=8&t=0s
        gfs.remove({
            filename: video.fileName, root: 'uploads'
        }, (error, gridStorage) => {
            if (error) {
                req.session.flash = {
                    type: 'error',
                    text: 'Could not delete video.'
                  }
                  res.redirect('/')
            } else {
                req.session.flash = {
                    type: 'success',
                    text: 'The Video has been succesfully deleted.'
                  }
                  res.redirect('/')
            }
        })
      }
    })

module.exports = router
