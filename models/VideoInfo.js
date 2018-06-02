/**
 * Defines DB storage of video info
 */

'use strict'

const mongoose = require('mongoose')

// Defines schema
const videoInfoSchema = mongoose.Schema({
  fileName: {
    type: String, required: true
  },
  thumbnailName: {
    type: String
  },
  contentType: {
    type: String, required: true
  },
  title: {
    type: String, required: true
  },
  description: {
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

// Creates the model object
const Videoinfo = mongoose.model('Video', videoInfoSchema)

module.exports = Videoinfo
