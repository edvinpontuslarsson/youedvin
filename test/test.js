'use strict'

const expect = require('chai').expect
const Lib = require('../lib/Lib')
const lib = new Lib()

describe('Test of the random string generator function in Lib', () => {
    describe('Tests the logic of this testing function', () => {
        it('isIdentical(notRandom, 2) should return true', (done) => {
            const result = isIdentical(notRandom, 2)
            expect(result).to.eql(true)
            done()
        })

    describe('Even if called ten thousand times, strings should never be identical', () => {
        it('isIdentical(lib.randomString, 10000) should return false', (done) => {
            const result = isIdentical(lib.randomString, 10000)
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
 * Calls funcToTest as many times as specified in iterations. 
 * Checks if any of the generated strings are identical. 
 * @param {*} funcToTest - function to test
 * @param {*} iterations - amount of times to test
 */
function isIdentical (funcToTest, iterations) {
    const testArr = []
    let identical = false

    // loops as many times as specified when called
    for (let i = 0; i < iterations; i += 1) {
        let randomString = funcToTest()

        // populates the test array with the first string
        if (i === 0) {
            testArr.push(randomString)
        }

        // checks if current string is identical with
        // any previously generated strings
        for (let j = 0; j < testArr.length; j += 1) {
            if (i !== 0 && randomString === testArr[j]) {
                identical = true
            }
        }

        // populates the test array with the second string and onward
        if (i >= 1) {
            testArr.push(randomString)
        }
    }

    // boolean
    return identical
}
