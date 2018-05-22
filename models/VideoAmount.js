/**
 * @author Edvin Larsson
 *
 * Model for keeping track of the total amount of
 * uploaded videos
 *
 * @requires mongoose
 */

'use strict'

const mongoose = require('mongoose')

const videoAmountSchema = mongoose.Schema({
  name: {
    type: String, required: true, default: 'VideoAmount'
  },
  amount: {
    type: Number, required: true, default: 0
  }
})

const VideoAmount = mongoose.model('Amount', videoAmountSchema)

module.exports = VideoAmount
