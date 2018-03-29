/**
 * @module User.js
 * @author Edvin Larsson
 *
 * Model for video
 *
 * @requires fs
 * @requires mongoose
 * @requires gridfs-stream
 * @requires crypto
 */

'use strict'

const fs = require('fs')
const mongoose = require('mongoose')
const crypto = require('crypto')
const Grid = require('gridfs-stream')

const videoSchema = mongoose.Schema({
    title: {
        type: String, required: true
    },
    description : {
        type: String
    },
    createdAt: {
        type: Date, required: true, default: Date.now
      },
    createdBy: {
        type: String, required: true
      },
    creatorId: {
        type: String, required: true
      }
})

const Video = mongoose.model('Video', videoSchema)

module.exports = Video
