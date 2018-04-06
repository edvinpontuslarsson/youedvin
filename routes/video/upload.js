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

const router = require('express').Router()
const Video = require('../../models/Video')
const mongoose = require('mongoose')
const path = require('path')
const Grid = require('gridfs-stream')
const Lib = require('../../lib/Lib')
const lib = new Lib()

const csrf = require('csurf')
const csrfProtection = csrf()

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
    .post(csrfProtection, async (req, res) => {
      if (!req.session.username) {
        res.status(403)
        res.render('error/403')
      } else {
        const file = req.files.video
        const extName = path.extname(file.name)

        if (okayFormat(extName) === false) {
          req.session.flash = {
            type: 'error',
            text: 'Unsupported file format'
          }
          res.redirect('/upload')
        } else {
          const fileNick = lib.randomNrs()
          const fileName = fileNick + extName

          const video = new Video({
            fileNick: fileNick,
            fileName: fileName,
            title: req.body.title,
            description: req.body.description,
            createdBy: req.session.username,
            creatorId: req.session.userid
          })

          // saves video info in separate schema
          await video.save()

          const writeStream = gfs.createWriteStream({
            filename: fileName,
            content_type: file.mimetype
          })

        // inspired by method used here:
        // https://github.com/houssem-yahiaoui/fileupload-nodejs/blob/master/routings/routing.js
          writeStream.on('close', (video) => {
            if (video) {
              req.session.flash = {
                type: 'success',
                text: 'The Video has been succesfully uploaded!'
              }
            } else {
              req.session.flash = {
                type: 'error',
                text: 'The Video upload failed :/'
              }
            }
          })

          writeStream.write(file.data, () => {
            writeStream.end()
          })

          res.redirect('.')
        }
      }
    })

/**
 * Checks file format
 * https://en.wikipedia.org/wiki/HTML5_video#Supported_video_and_audio_formats
 * @param {any} extName - filename extension
 */
function okayFormat (extName) {
  let answer = false

  if (extName === '.webm' ||
        extName === '.mp4' ||
        extName === '.m4a' ||
        extName === '.m4p' ||
        extName === '.m4b' ||
        extName === '.m4r' ||
        extName === '.m4v' ||
        extName === '.ogv' ||
        extName === '.ogg') {
    answer = true
  }

  return answer
}

module.exports = router
