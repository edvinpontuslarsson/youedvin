'use strict'

const GridFsStorage = require('multer-gridfs-storage')
const path = require('path')
const Lib = require('../lib/Lib')

/**
 * Defines storage of files with validation
 */
const storage = new GridFsStorage({
    url: process.env.dbURL,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
  
        // see the error handling in the app-module for how these errors are handled
        if (Lib.validate.extName(file.originalname) === false) {
          return reject(new Error('Upload attempt with unsupported file format'))
        } else if (!req.session.username) {
          return reject(new Error('Unauthorized file upload attempt'))
  
          // changes the file name before storing
        } else {
          const fileName = Lib.make.randomString() + path.extname(file.originalname)
          console.log(fileName)
          const fileInfo = {
            filename: fileName,
            bucketName: 'uploads'
          }
          resolve(fileInfo)
        }
      })
    }
  })

module.exports = storage
