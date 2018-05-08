'use strict'

const VideoInfo = require('../../models/VideoInfo')
const path = require('path')

const get = {
  /**
   * @param {string} fileName
   * @returns one videos info as a promise
   */
  aVideo: (fileName) => {
    return VideoInfo.findOne({
      fileName: fileName
    }).exec()
  },

  /**
   * @param {number} limit - amount to limit
   * @param {number} skip - amount to skip
   * @returns specified amount of videos info, as promise
   */
  newestVideos: (limit, skip) => {
      const videoInfo = VideoInfo.find({}).sort({
        createdAt: 'descending'
      }).limit(limit).skip(skip).exec()
      return videoInfo
  },

  /**
   * Sorts newest first
   * @param {string} queryString - searches for matching titles
   * @param {number} limit - amount to limit
   * @param {number} skip - amount to skip
   * @returns specified amount of videos info, as promise
   */
  videosByTitle: (queryString, limit, skip) => {    
    // Gets regular expression, using method described by the holla here: https://stackoverflow.com/questions/38421664/fuzzy-searching-with-mongodb
    const regEx = new RegExp(
      escapeRegex(queryString), 'gi'
    )

    const videoInfo = VideoInfo.find({
      title: regEx
    }).sort({
      createdAt: 'descending'
    }).limit(limit).skip(skip).exec()
    return videoInfo
  }
}

/**
 * Helper function for regular expression 
 * using method described by Mathias Bynens here: https://stackoverflow.com/questions/3115150/how-to-escape-regular-expression-special-characters-using-javascript
 * @param string - queryString
 * @returns - modified queryString for regular expression
 */
const escapeRegex = (string) => {
  return string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

module.exports = get
