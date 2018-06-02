/**
 * For handling file system
 */

'use strict'

const fs = require('fs')

/**
 * Object with functions
 */
const fsDAO = {
  /**
     * @param {string} filePath
     * @returns file as promise
     */
  getFile: (filePath) => {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, (err, file) => {
        if (err) throw err
        resolve(file)
      })
    })
  },

  /**
     * Asynchronously writes data to a file,
     * replacing the file if it already exists.
     * data can be a string or a buffer.
     * https://nodejs.org/api/fs.html
     * @param {string} filePath
     * @param data - to write
     * @returns true if succesful
     */
  putFile: (filePath, data) => {
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, data, (err) => {
        if (err) throw err
        resolve(true)
      })
    })
  },

  deleteFile: (filePath) => {

  }
}

module.exports = fsDAO
