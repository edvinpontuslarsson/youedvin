'use strict'

const expect = require('chai').expect
const Lib = require('../lib/Lib')
const lib = new Lib()

describe('Test of the random string generator function in Lib', () => {
    describe('Even if called a million times, strings should never be identical', () => {
        it('isIdentical() should return false', (done) => {
            const result = isIdentical(1000000)
            expect(result).to.eql(false)
            done()
        })
    })
})


/**
 * Even if called a million times, strings should never be identical
 * Should therefore return false
 */
function isIdentical (tries) {
    let testString
    let identical = false

    for (let i = 0; i < tries; i += 1) {
        let randomString = lib.randomString()
        if (testString === randomString) {
            identical = true
        }
        testString = randomString
    }

    return identical
}

// https://stackoverflow.com/questions/39384321/how-to-fetch-and-reuse-the-csrf-token-using-postman-rest-client/49249850#49249850