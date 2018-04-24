'use strict'

const expect = require('chai').expect
const VideoLib = require('../lib/VideoLib')
const VidTest = require('./VideoTestingTools')

describe('Test of VideoLib.okayExtName()', () => {
  describe('Test with filename without extension', () => {
    it(`VideoLib.okayExtName('test') should return false`, (done) => {
      const answer = VideoLib.okayExtName('test')
      expect(answer).to.eql(false)
      done()
    })
  })

  describe('Test with filename with incorrect extension', () => {
    it(`VideoLib.okayExtName('test.pdf') should return false`, (done) => {
      const answer = VideoLib.okayExtName('test.pdf')
      expect(answer).to.eql(false)
      done()
    })
  })

  describe('Test with filename with correct extension', () => {
    it(`VideoLib.okayExtName('test.mp4') should return true`, (done) => {
      const answer = VideoLib.okayExtName('test.mp4')
      expect(answer).to.eql(true)
      done()
    })
  })

  describe('Test with filename with correct extension', () => {
    it(`VideoLib.okayExtName('test.webm') should return true`, (done) => {
      const answer = VideoLib.okayExtName('test.webm')
      expect(answer).to.eql(true)
      done()
    })
  })
})

describe('Test of VideoLib.randomString() with VidTest.isIdentical()', () => {
  describe('Tests the logic of this testing method', () => {
    it('VidTest.isIdentical(VidTest.notRandom, 2) should return true', (done) => {
      const result = VidTest.isIdentical(VidTest.notRandom, 2)
      expect(result).to.eql(true)
      done()
    })
  })

  describe('Even if called ten thousand times, strings should never be identical', () => {
    it('VidTest.isIdentical(VideoLib.randomString, 10000) should return false', (done) => {
      const result = VidTest.isIdentical(VideoLib.randomString, 10000)
      expect(result).to.eql(false)
      done()
    })
  })
})

describe('Test of VideoLib.makeIndexArr() with VidTest.mockVideoObjArr()', () => {
  describe(`Tests that VideoLib.makeIndexArr() returns an array
    with the same length as called with if limit is not exceeded`, () => {
    it(`VideoLib.makeIndexArr(5, VidTest.mockVideoObjArr(4)) 
      should return an array with length 4`, (done) => {
      const result = VideoLib.makeIndexArr(5, VidTest.mockVideoObjArr(4))
      expect(result.length).to.eql(4)
      done()
    })
  })

  describe(`Tests that VideoLib.makeIndexArr() returns an array
    with the same length as the limit when limit is exceeded by 1`, () => {
    it(`VideoLib.makeIndexArr(3, VidTest.mockVideoObjArr(4)) 
      should return an array with length 3`, (done) => {
      const result = VideoLib.makeIndexArr(3, VidTest.mockVideoObjArr(4))
      expect(result.length).to.eql(3)
      done()
    })
  })
})
