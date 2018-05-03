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
  newestVideos: (req, res, limit, skip) => {
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
  }
}

module.exports = get
