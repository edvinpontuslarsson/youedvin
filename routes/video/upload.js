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
const Grid = require('gridfs-stream')
const router = require('express').Router()
const Lib = require('../../lib/Lib')
const lib = new Lib()

const csrf = require('csurf')
const csrfProtection = csrf()
const Video = require('../../models/Video')

// gridfs-stream documentation: https://github.com/aheckmann/gridfs-stream
// has remove method

const connection = mongoose.connection
Grid.mongo = mongoose.mongo
let gfs

// inspired by method used here:
// https://github.com/houssem-yahiaoui/fileupload-nodejs/blob/master/routings/routing.js
connection.once('open', () => {
  gfs = Grid(connection.db)
  console.log('Ready for video uploads')
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
    .post(csrfProtection, (req, res) => {
      if (!req.session.username) {
        res.status(403)
        res.render('error/403')
      } else {
        const video = req.files.video

        const fileName = lib.randomNrs() + path.extname(video.name)

        console.log(fileName)

        // const writeStream = gfs.createWriteStream({
          
        //})

        req.session.flash = {
          type: 'success',
          text: 'The Video has been succesfully uploaded!'
        }

        res.redirect('.')
      }
    })

module.exports = router
