/**
 * @module User.js
 * @author Edvin Larsson
 *
 * Model for video
 *
 * @requires fs
 * @requires mongoose
 * @requires crypto
 */

'use strict'

const mongoose = require('mongoose')

const videoSchema = mongoose.Schema({
  fileNick: {
    type: String, required: true
  },
  fileName: {
    type: String, required: true
  },
  title: {
    type: String, required: true
  },
  description: {
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
