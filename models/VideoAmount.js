/**
 * Model for keeping track of the total amount of
 * uploaded videos
 */

'use strict'

const mongoose = require('mongoose')

// Defines schema
const videoAmountSchema = mongoose.Schema({
  name: {
    type: String, required: true, default: 'VideoAmount'
  },
  amount: {
    type: Number, required: true, default: 0
  }
})

// Creates the model object
const VideoAmount = mongoose.model('Amount', videoAmountSchema)

module.exports = VideoAmount
