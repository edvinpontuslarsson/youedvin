/**
 * Part of Lib object
 */

'use strict'

const path = require('path')
const fileType = require('file-type')

/**
 * Object with functions
 */
const validate = {
  /**
   * Validates mimetyp, 
   * @param file - file to inspect
   * @param cB - callback
   */
  mimeType: (file, cB) => {
    // console.log(file)
    // console.log(file.buffer)
    if (!path.extname(file.originalname)) {
      return false
    } else {
      const fType = fileType(file.buffer)
      console.log(fType)

      return fType === 'video/webm' ||
        fType === 'video/ogg'
    }
  },

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
        message:
          'The username is already taken, please choose a different one!',
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
