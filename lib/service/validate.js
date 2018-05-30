/**
 * Part of Lib object
 */

'use strict'

/**
 * Object with functions
 */
const validate = {
  /**
   * Validates the mimetype of the file
   * https://en.wikipedia.org/wiki/HTML5_video#Supported_video_and_audio_formats
   * @param {string} file
   * @returns true if mimetype is supported
   *//*
  mimeType: (file) => {
    return file.mimetype === 'video/mp4' ||
      file.mimetype === 'video/webm' ||
      file.mimetype === 'video/ogg'
  },*/

  /**
   *
   * @param {*} username
   * @param {*} password
   * @param {*} confirmPassword - should be identical to password
   * @param {*} ifAlreadyExists - result from DB search, should be null
   *
   * @returns object, okay: boolean, message: string, status: number
   */
  registration: (username, password, confirmPassword, ifAlreadyExists) => {
    if (password.length < 5) {
      return {
        okay: false,
        message: 'The password needs to be at least 5 characters long',
        status: 400
      }
    } else if (password !== confirmPassword) {
      return {
        okay: false,
        message: 'The passwords do not match',
        status: 400
      }
    } else if (ifAlreadyExists !== null) {
      return {
        okay: false,
        message: 'The username is already taken, please choose a different one!',
        status: 409
      }
    } else if (username.length > 30) {
      return {
        okay: false,
        message: 'The username cannot be longer than 30 characters',
        status: 400
      }
    } else {
      return {
        okay: true,
        message: 'Good to go!',
        status: 200
      }
    }
  }
}

module.exports = validate
