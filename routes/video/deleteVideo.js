'use strict'

const router = require('express').Router()
const mongoose = require('mongoose')
const VideoInfo = require('../../models/VideoInfo')
const VideoLib = require('../../lib/VideoLib')
const videoLib = new VideoLib()
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
      const video = await videoLib.getVideoInfoByFileName(req.params.id)

      if (video.creatorId !== req.session.userid) {
        res.status(403)
        res.render('error/403')
      } else {
        res.status(200)
        res.header({ csrfToken: req.csrfToken() })
        res.render('video/delete', {
          csrfToken: req.csrfToken(),
          id: req.params.id,
          title: video.title
        })
      }
    })

    .post(csrfProtection, async (req, res) => {
      const video = await videoLib.getVideoInfoByFileName(req.params.id)

      if (video.creatorId !== req.session.userid) {
        res.status(403)
        res.render('error/403')
      } else {
        res.status(200)
        // deletes video info
        await VideoInfo.findOneAndRemove({
          fileName: req.params.id
        })

        // deletes the video file
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
