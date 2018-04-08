const router = require('express').Router()
const mongoose = require('mongoose')
const Lib = require('../../lib/Lib')
const lib = new Lib()

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
  console.log('Ready for fetching video')
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
      const readStream = gfs.createReadStream(videoFile.filename)
      readStream.pipe(res)
    })
  })

router.route('/play/:id')
  .get(async (req, res) => {
    const fileName = req.params.id

    const videoInfo = await lib.getVideoInfo(fileName)
    const title = videoInfo.title

    // see if I can do this with async await
    // similarly to how I get VideoInfo
    gfs.files.findOne({
      filename: fileName
    }, (error, videoFile) => {
      res.render('video/play', {
        title, videoFile
      })
    })
  })

module.exports = router
