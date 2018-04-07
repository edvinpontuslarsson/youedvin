const router = require('express').Router()
const Video = require('../../models/Video')
const mongoose = require('mongoose')
const fs = require('fs')
const Lib = require('../../lib/Lib')
const lib = new Lib()

/*
const csrf = require('csurf')
const csrfProtection = csrf()
*/

const connection = mongoose.connection
const Grid = require('gridfs-stream')
const multer = require('multer')
const GridFsStorage = require('multer-gridfs-storage')
let gfs

// Inspired by: https://www.youtube.com/watch?v=3f5Q9wDePzY
connection.once('open', () => {
  gfs = Grid(connection.db, mongoose.mongo)
  gfs.collection('uploads')
  console.log('Ready for fetching video')
})

router.route('/play/:id')
  .get(async (req, res) => {      
      const fileName = req.params.id

      const videoInfo = await lib.getVideoInfo(fileName)
      const title = videoInfo.title

      // test without await, should restructure
      // watch until end, see if I need stream

      const videoFile = await fetchVideo(fileName)

      console.log(videoFile)

      console.log('Hello')

      res.render('video/play', { 
        title, videoFile
      })
  })

/**
 * Fetches the video file
 */
function fetchVideo (fileName) {
  // should have if no file, return 404
  return gfs.files.findOne({
    filename: fileName
  })
}


module.exports = router
