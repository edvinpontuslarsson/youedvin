/**
 * Part of Lib object
 */

'use strict'

/**
 * Object with functions
 */
const make = {
  /**
   * Function inspired by getRandomInt(min, max) here:
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
   * @param atLeast integer, returns equal or above
   * @param lessThan integer, returns a lower number
   * @returns random int between chosen range
   */
  randomInteger: (atLeast, lessThan) => {
    return Math.floor(Math.random() *
    (lessThan - atLeast) + atLeast)
  },

  /**
   * @returns random string
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
   * Maps the objects, selects the properties to display
   * and adds these to a new array.
   * If the amount of objects > limit, the last object gets
   * excluded
   * @param {Array} videoArr
   * @param {Number} limit - optional, amount to limit
   * @returns {Array} videos to display
   */
  indexArr: (videoArr, limit) => {
    const videosToDisplay = []
    let loopAmount = videoArr.length

    if (limit && videoArr.length > limit) {
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

module.exports = make
