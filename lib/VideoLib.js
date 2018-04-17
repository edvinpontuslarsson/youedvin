/**
 * General help functions
 */
'use strict'

const Video = require('../models/Video')
const path = require('path')

class VideoLib {
  /**
 * Checks extension name of posted files
 * https://en.wikipedia.org/wiki/HTML5_video#Supported_video_and_audio_formats
 * @param {any} fileName
 * @returns {boolean} boolean
 */
okayExtName (fileName) {
  const extName = path.extname(fileName)
  let answer = false

  if (extName === '.webm' ||
      extName === '.mp4' ||
      extName === '.m4a' ||
      extName === '.m4p' ||
      extName === '.m4b' ||
      extName === '.m4r' ||
      extName === '.m4v' ||
      extName === '.ogv' ||
      extName === '.ogg') {
    answer = true
  }

  return answer
}
  
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
