const router = require('express').Router()
const Video = require('../../models/Video')
const fs = require('fs')
const Lib = require('../../lib/Lib')
const lib = new Lib()

/*
const csrf = require('csurf')
const csrfProtection = csrf()
*/

const Grid = require('gridfs-stream')
const mongoose = require('mongoose')

const connection = mongoose.connection
Grid.mongo = mongoose.mongo
let gfs

connection.once('open', () => {
  gfs = Grid(connection.db)
  console.log('Ready for fetching stored video')
})

router.route('/play/:id')
  .get(async (req, res) => {
    const fileNick = req.params.id

    const videoInfo = await lib.getVideoInfo(fileNick)
  })


module.exports = router
