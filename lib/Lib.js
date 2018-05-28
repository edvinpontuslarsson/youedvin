'use strict'

const Lib = {
  /**
   * Module for fetching
   */
  get: require('./service/get'),

  /**
   * Module for creating
   */
  make: require('./service/make'),

  /**
   * Module for validation
   */
  validate: require('./service/validate')
}

module.exports = Lib
