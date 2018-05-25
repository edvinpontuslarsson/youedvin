'use strict'

const router = require('express').Router()
const mongoose = require('mongoose')
const VideoInfo = require('../../models/VideoInfo')
const VideoAmount = require('../../models/VideoAmount')
const Lib = require('../../lib/Lib')

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
  .get(async (req, res) => {
    const video = await Lib.get.aVideo(req.params.id)

    if (video === null) {
      res.status(404)
      return res.render('error/404')
    }

    if (video.creatorId !== req.session.userid) {
      res.status(403)
      res.render('error/403')

    // if everything is OK
    } else {
      res.status(200)
      res.render('video/delete', {
        id: req.params.id,
        title: video.title
      })
    }
  })

  // to delete video
  .post(async (req, res) => {
    const video = await Lib.get.aVideo(req.params.id)

    if (video.creatorId !== req.session.userid) {
      res.status(403)
      res.render('error/403')
    } else {
      res.status(200)

      // deletes video info
      await VideoInfo.findOneAndRemove({
        fileName: req.params.id
      })

      // updates video amount
      const videoAmount = await VideoAmount.findOne({
        name: 'VideoAmount'
      })
      videoAmount.amount -= 1
      await videoAmount.save()

      // deletes video file
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
