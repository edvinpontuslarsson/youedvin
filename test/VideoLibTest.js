'use strict'

const expect = require('chai').expect
const VideoLib = require('../lib/VideoLib')
const videoLib = new VideoLib()
const VideoTestingTools = require('./VideoTestingTools')
const vidTest = new VideoTestingTools()

describe('Test of videoLib.okayExtName()', () => {
  describe('Test with filename without extension', () => {
    it(`videoLib.okayExtName('test') should return false`, (done) => {
      const answer = videoLib.okayExtName('test')
      expect(answer).to.eql(false)
      done()
    })
  })

  describe('Test with filename with incorrect extension', () => {
    it(`videoLib.okayExtName('test.pdf') should return false`, (done) => {
      const answer = videoLib.okayExtName('test.pdf')
      expect(answer).to.eql(false)
      done()
    })
  })

  describe('Test with filename with correct extension', () => {
    it(`videoLib.okayExtName('test.mp4') should return true`, (done) => {
      const answer = videoLib.okayExtName('test.mp4')
      expect(answer).to.eql(true)
      done()
    })
  })

  describe('Test with filename with correct extension', () => {
    it(`videoLib.okayExtName('test.webm') should return true`, (done) => {
      const answer = videoLib.okayExtName('test.webm')
      expect(answer).to.eql(true)
      done()
    })
  })
})

describe('Test of videoLib.randomString() with vidTest.isIdentical()', () => {
  describe('Tests the logic of this testing method', () => {
    it('vidTest.isIdentical(vidTest.notRandom, 2) should return true', (done) => {
      const result = vidTest.isIdentical(vidTest.notRandom, 2)
      expect(result).to.eql(true)
      done()
    })
  })

  describe('Even if called ten thousand times, strings should never be identical', () => {
    it('vidTest.isIdentical(lib.randomString, 10000) should return false', (done) => {
      const result = vidTest.isIdentical(videoLib.randomString, 10000)
      expect(result).to.eql(false)
      done()
    })
  })
})

describe('Test of videoLib.makeIndexArr() with vidTest.mockVideoObjArr()', () => {
  describe(`Tests that videoLib.makeIndexArr() returns an array
    with the same length as called with if limit is not exceeded`, () => {
    it(`videoLib.makeIndexArr(5, vidTest.mockVideoObjArr(4)) 
      should return an array with length 4`, (done) => {
      const result = videoLib.makeIndexArr(5, vidTest.mockVideoObjArr(4))
      expect(result.length).to.eql(4)
      done()
    })
  })

  describe(`Tests that videoLib.makeIndexArr() returns an array
    with the same length as the limit when limit is exceeded by 1`, () => {
    it(`videoLib.makeIndexArr(3, vidTest.mockVideoObjArr(4)) 
      should return an array with length 3`, (done) => {
      const result = videoLib.makeIndexArr(3, vidTest.mockVideoObjArr(4))
      expect(result.length).to.eql(3)
      done()
    })
  })
})
