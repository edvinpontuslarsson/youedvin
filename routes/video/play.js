'use strict'

const router = require('express').Router()
const mongoose = require('mongoose')
const VideoLib = require('../../lib/VideoLib')
const videoLib = new VideoLib()

/*
const csrf = require('csurf')
const csrfProtection = csrf()
*/

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
  console.log('Ready for fetching videos')
})

/**
 * Creates a readstream to the video file
 * Inspired by: https://www.youtube.com/watch?v=3f5Q9wDePzY&t=2422s
 */
router.route('/video/:id')
  .get((req, res) => {
    const fileName = req.params.id

    // see if I can do this with async await
    // similarly to how I get VideoInfo
    // in separate function
    // perhaps have a readstream module
    gfs.files.findOne({
      filename: fileName
    }, (error, videoFile) => {
      if (error) {
        res.status(500)
        res.redirect('/')
      }

      const readStream = gfs.createReadStream(videoFile.filename)
      readStream.pipe(res)
    })
  })

router.route('/play/:id')
  .get(async (req, res) => {
    const fileName = req.params.id

    const videoInfo = await videoLib.getVideoInfoByFileName(fileName)

    if (videoInfo === null) {
      res.status(404)
      res.render('error/404')
    } else {
    // see if I can do this with async await
    // similarly to how I get VideoInfo
      gfs.files.findOne({
        filename: fileName
      }, (error, videoFile) => {
        if (error) {
          res.status(500)
          res.redirect('/')
        }

        if (videoInfo.createdBy === req.session.username) {
          videoInfo.canEdit = true
        }

        res.status(200)
        res.render('video/play', {
          videoInfo, videoFile
        })
      })
    }
  })

module.exports = router
