'use strict'

const VideoInfo = require('../../models/VideoInfo')
const path = require('path')

const get = {
  /**
   * Returns one videos info as a promise
   * @param {string} fileName
   */
  aVideo: (fileName) => {
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
  newestVideos: (limit, skip) => {
      const videoInfo = VideoInfo.find({}).sort({
        createdAt: 'descending'
      }).limit(limit).skip(skip).exec()
      return videoInfo
  },

  videosByTitle: (limit, skip) => {
    try {
    
    // server error
    } catch (error) {
      
    }
  }
}

module.exports = get
