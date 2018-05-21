'use strict'

const Lib = {
  /**
   * Module for calculating
   */
  calc: require('./service/calc'),

  /**
   * Module for getting
   */
  get: require('./service/get'),

  /**
   * Module for making
   */
  make: require('./service/make'),

  /**
   * Module for saving
   */
  save: require('./service/save'),

  /**
   * Module for thumbnailing
   */
  thumbnail: require('./service/thumbnail'),

  /**
   * Module for validating
   */
  validate: require('./service/validate')
}

module.exports = Lib
