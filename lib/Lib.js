'use strict'

const Lib = {
  /**
     * Module for calculating
     */
  calc: require('./service/calc'),

  /**
     * Module for fetching
     */
  get: require('./service/get'),

  /**
     * Module for creating
     */
  make: require('./service/make'),

  /**
     * Module for searching
     */
  search: require('./service/search'),

  /**
     * Module for thumbnailing
     */
  thumbnail: require('./service/thumbnail'),

  /**
     * Module for validation
     */
  validate: require('./service/validate')
}

module.exports = Lib
