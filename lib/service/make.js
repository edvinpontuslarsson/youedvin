'use strict'

const make = {
/**
 * Makes a string of random numbers
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
   * @returns {Array} videosToDisplay
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
