/**
 * General help functions
 */

const Video = require('../models/Video')
const mongoose = require('mongoose')

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

  /**
   * Returns video info as a promise
   * @param {*} fileName 
   */
  getVideoInfo (fileName) {
    return Video.findOne({
      fileName: fileName
    }).exec()
  }
}

module.exports = Lib
