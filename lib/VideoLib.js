/**
 * General help functions
 */
'use strict'

const Video = require('../models/Video')

class VideoLib {
    /**
     * Generates a string of random numbers
     */
  randomString () {
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
  getVideoInfoByFileName (fileName) {
    return Video.findOne({
      fileName: fileName
    }).exec()
  }

  /**
   * Returns video info as a promise
   * @param {*} creatorId
   *//**
  getVideoInfoBycreatorId (creatorId) {
    return Video.findOne({
      creatorId: creatorId
    }).exec()
  }
  */
}

module.exports = VideoLib
