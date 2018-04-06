const router = require('express').Router()
const Video = require('../../models/Video')
const fs = require('fs')
const Lib = require('../../lib/Lib')
const lib = new Lib()

/*
const csrf = require('csurf')
const csrfProtection = csrf()
*/

router.route('/play/:id')
  .get(async (req, res) => {
    const fileNick = req.params.id

    const videoInfo = await lib.getVideoInfo(fileNick)
    const video = await fetchVideo(videoInfo)

    console.log(video)

    return res.render('video/play', video)
  })

const Grid = require('gridfs-stream')
const mongoose = require('mongoose')

const connection = mongoose.connection
Grid.mongo = mongoose.mongo
let gfs

// inspired by method used here:
// https://github.com/houssem-yahiaoui/fileupload-nodejs/blob/master/routings/routing.js
connection.once('open', () => {
  gfs = Grid(connection.db)
  console.log('Ready for fetching stored video')
})

/**
 * Inspired by a method described by Robert Mitchell here:
 * https://stackoverflow.com/questions/15380793/read-file-with-node-js-mongoose-gridfs-stream
 */
function fetchVideo (videoInfo) {
  return new Promise ((resolve, reject) => {

  const writeStream = gfs.createWriteStream({
    filename: videoInfo.fileName
  })

  fs.createReadStream(videoInfo.fileName).pipe(writeStream)

  const buffer = ''

  writeStream.on('close', () => {
    const readStream = gfs.createReadStream({
      filename: videoInfo.fileName
    })
    
    readStream.on('data', (chunk) => {
      buffer += chunk
    })
  
    readStream.on('end', () => {
      console.log("contents of file:\n\n", buffer)
      resolve(buffer)
    })
  })

  // also see documentation for gridfs-stream
  // link there to big node page

  // https://github.com/aheckmann/gridfs-stream

  // https://nodejs.org/docs/v0.10.36/api/stream.html#stream_stream

  // below is not working maybe need to pipe somehow
  // more basic research is needed:
  // https://www.google.se/search?client=ubuntu&hs=4eS&channel=fs&dcr=0&biw=1855&bih=982&ei=YyjGWq_yO8fQwALVrJUQ&q=readstream+pipe&oq=readstream+pip&gs_l=psy-ab.3.0.0i203k1j0i22i30k1j0i22i10i30k1l2.135994.139916.0.141184.29.19.0.1.1.0.150.1986.2j16.19.0....0...1c.1.64.psy-ab..13.16.1712.6..0j0i19k1j0i22i30i19k1j35i39k1j0i131k1j0i67k1j0i131i67k1j0i10k1j0i13k1.140.ZtHxp3Dozi8
  })
}

// https://stackoverflow.com/questions/37408227/how-to-read-a-video-with-gridfs-stream

module.exports = router
