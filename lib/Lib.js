'use strict'

const Lib = {
    /**
     * Module for fetching
     */
    get: require('./assistance/get'),

    /**
     * Module for creating
     */
    make: require('./assistance/make'),

    /**
     * Module for thumbnailing
     */
    thumbnail: require('./assistance/thumbnail'),    

    /**
     * Module for validation
     */
    validate: require('./assistance/validate')
}

module.exports = Lib
