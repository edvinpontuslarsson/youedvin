/**
 * General help functions
 */

const Video = require('../models/Video')

class Lib {
    /**
     * Generates a string of random numbers
     */
  randomNrs () {
    let nrString = ''

    for (let i = 0; i < 15; i += 1) {
      let randNr = Math.floor((Math.random() * 12))
      nrString += randNr.toString()
    }

    return nrString
  }

  async getVideoInfo (fileNick) {
    return await Video.findOne({
      fileNick: fileNick
    }).exec()
  }
}

module.exports = Lib
