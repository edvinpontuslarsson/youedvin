const Grid = require('gridfs-stream')

const connection = mongoose.connection
Grid.mongo = mongoose.mongo
let gfs

// perhaps later just get from Video model here
// readstream only on video page

connection.once('open', () => {
  gfs = Grid(connection.db)
  console.log('Ready for fetching stored video')
})

/**
 * Call this inside the get route
 * only for one video
 * inspired by method used here:
 * https://github.com/houssem-yahiaoui/fileupload-nodejs/blob/master/routings/routing.js
 */
function fetchVideo () {
// just console.log first

  gfs.files.find({
    
  }).toArray((error, collection) => {
    const data = []

    const readstream = gfs.createReadStream({

    })
  })
}