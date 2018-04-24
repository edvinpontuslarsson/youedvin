/**
 * General help functions
 */
'use strict'

const VideoInfo = require('../models/VideoInfo')
const path = require('path')

const VideoLib = {
/**
 * Validates the type of extension name of posted files
 * https://en.wikipedia.org/wiki/HTML5_video#Supported_video_and_audio_formats
 * @param {string} fileName
 * @returns {boolean} boolean
 */
  okayExtName: (fileName) => {
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
  },

  /**
   * Generates a string of random numbers
   */
  randomString: () => {
    let nrString = ''

    for (let i = 0; i < 15; i += 1) {
      let randNr = Math.floor((Math.random() * 12))
      nrString += randNr.toString()
    }

    return nrString
  },

  /**
   * Returns one videos info as a promise
   * @param {*} fileName
   */
  getVideoInfoByFileName: (fileName) => {
    return VideoInfo.findOne({
      fileName: fileName
    }).exec()
  },

  /**
 * Returns specified amount of videos info,
 * as promise
 * @param {*} req - request
 * @param {*} res - response
 * @param {number} limit - amount to limit
 * @param {number} skip - amount to skip
 */
  getSomeVideoInfo: (req, res, limit, skip) => {
    try {
      const videoInfo = VideoInfo.find({}).sort({
        createdAt: 'descending'
      }).limit(limit).skip(skip).exec()
      return videoInfo
    } catch (error) {
      req.session.flash = {
        type: 'error',
        text: 'Something went wrong'
      }
      res.status(500)
      res.redirect('/')
    }
  },

  /**
   * Maps the objects, selects the properties to display
   * and adds these to a new array.
   * If the amount of objects > limit, the last object gets
   * excluded
   * @param {Number} limit - amount to limit
   * @param {Array} videoArr
   * @returns {Array} videosToDisplay
   */
  makeIndexArr: (limit, videoArr) => {
    const videosToDisplay = []
    let loopAmount = videoArr.length

    if (videoArr.length > limit) {
      loopAmount -= 1
    }

    for (let i = 0; i < loopAmount; i += 1) {
      const videoObj = {
        fileName: videoArr[i].fileName,
        title: videoArr[i].title,
        createdBy: videoArr[i].createdBy,
        createdAt: videoArr[i].createdAt
      }
      videosToDisplay.push(videoObj)
    }
    return videosToDisplay
  }
}

module.exports = VideoLib
