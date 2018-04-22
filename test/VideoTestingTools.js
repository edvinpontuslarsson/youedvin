class VideoTestingTools {
/**
 * This is not random
 */
  notRandom () {
    return 'the same thing every time'
  }

/**
 * Calls funcToTest as many times as specified in iterations.
 * Checks if any of the generated strings are identical.
 * @param {*} funcToTest - function to test
 * @param {number} iterations - amount of times to test
 * @returns {boolean} identical
 */
  isIdentical (funcToTest, iterations) {
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

    return identical
  }

  /**
   * Returns array with specified amount of mock 
   * video info objects
   * @param {Number} amount 
   */
  mockVideoObjArr (amount) {
    const mockArr = []

    for (let i = 0; i < amount; i += 1) {
      const mockObj = {
        fileName: 'just mock',
        title: 'just mock',
        createdBy: 'just mock',
        createdAt: 'just mock'
      }
      mockArr.push(mockObj)
    }
    return mockArr
  }
}

module.exports = VideoTestingTools
