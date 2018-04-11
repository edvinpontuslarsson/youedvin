/**
 * @module User.js
 * @author Edvin Larsson
 *
 * Model for video info
 *
 * @requires fs
 * @requires mongoose
 * @requires crypto
 */

'use strict'

const mongoose = require('mongoose')

const videoSchema = mongoose.Schema({
  fileNick: {
    type: String, required: false
  },
  fileName: {
    type: String, required: true
  },
  title: {
    type: String, required: true
  },
  description: {
    type: String, required: false
  },
  category: {
    type: String, required: true, default: 'Lifestyle'
  },
  views: {
    type: String, required: false
  },
  likes: {
    type: String, required: false
  },
  dislikes: {
    type: String, required: false
  },
  amountOfComments: {
    type: String, required: false
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
