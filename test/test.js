'use strict'

const expect = require('chai').expect
const Lib = require('../lib/Lib')
const lib = new Lib()

describe('Test of the random string generator function in Lib', () => {
    describe('Tests the logic of testing function', () => {
        it('with notRandom isIdentical(2) should return true', (done) => {
            const result = isIdentical(notRandom, 2)
            expect(result).to.eql(true)
            done()
        })

    describe('Even if called a million times, strings should never be identical', () => {
        it('with lib.randomString isIdentical(1000000) should return false', (done) => {
            const result = isIdentical(lib.randomString, 1000000)
            expect(result).to.eql(false)
            done()
        })
    })
})
})

/**
 * This is not random
 */
function notRandom () {
    return 'the same thing every time'
}

/**
 * 
 * @param {*} toTest - function to test
 * @param {*} tries - amount of times to test
 */
function isIdentical (toTest, tries) {
    let testString
    let identical = false

    for (let i = 0; i < tries; i += 1) {
        let randomString = toTest()
        if (testString === randomString) {
            identical = true
        }
        testString = randomString
    }

    return identical
}

// https://stackoverflow.com/questions/27182701/how-do-i-send-spring-csrf-token-from-postman-rest-client
