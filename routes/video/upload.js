/**
 * @module upload
 * @author Edvin Larsson
 *
 * Route for uploading videos
 *
 * @requires express
 * @requires Video
 * @requires csurf
 * @requires formidable
 * @requires mongoose
 * @requires gridfs-stream
 * @requires fs
 */

'use strict'

const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const router = require('express').Router()
const Lib = require('../../lib/Lib')
const lib = new Lib()

const csrf = require('csurf')
const csrfProtection = csrf()

// const Video = require('../../models/Video')

const multer = require('multer')

// see more in this module
const GridFsStorage = require('multer-gridfs-storage')

/**
 * See this link for a module to save in schema
 * https://www.npmjs.com/package/mongoose-gridfs
 * "mongoose-gridfs wrap gridfs-stream to provide valid mongoose schema and model to use with MongoDB GridFS.

    Each instance of mongoose-gridfs is binded to a specific GridFS collection and mongoose model or schema by using options."

    http://blog.robertonodi.me/managing-files-with-node-js-and-mongodb-gridfs/
    */

const Grid = require('gridfs-stream')
const connection = mongoose.connection

// using this similarly to their documentation:
// https://www.npmjs.com/package/multer-gridfs-storage
connection.once('open', () => {
  const gfs = Grid(connection.db, mongoose.mongo)
  gfs.collection('videoData')
  console.log('Ready for video uploads')
})

const nrString = lib.randomNrs()

const storage = new GridFsStorage({
  url: process.env.dbURL,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err)
        }
        const filename = buf.toString('hex') + path.extname(file.originalname)
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        }
        resolve(fileInfo)
      })
    })
  }
})

const upload = multer({
  storage
})

router.route('/upload')
    // renders upload form, only for logged in users
    .get(csrfProtection, (req, res) => {
      if (!req.session.username) {
        res.status(403)
        res.render('error/403')
      } else {
        res.render('video/upload', {
          csrfToken: req.csrfToken()
        })
      }
    })

    // saves video to DB, only for logged in users
    // do I have that control now???
    .post(csrfProtection, upload.single('video'), (req, res) => {
      if (!req.session.username) {
        res.status(403)
        res.render('error/403')
      } else {
        console.log(req.file)

        req.session.flash = {
          type: 'success',
          text: 'The Video has been succesfully uploaded!'
        }

        res.redirect('.')
      }
    })

module.exports = router
