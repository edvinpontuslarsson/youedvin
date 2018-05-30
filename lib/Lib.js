/**
 * Exports object with objects with
 * helper functions
 */

'use strict'

const Lib = {
  get: require('./service/get'),
  make: require('./service/make'),
  validate: require('./service/validate')
}

module.exports = Lib
