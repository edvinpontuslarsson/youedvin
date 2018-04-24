'use strict'

const expect = require('chai').expect
const Lib = require('../lib/Lib')
const VidTest = require('./VideoTestingTools')

describe('Test of Lib.validate.extName()', () => {
  describe('Test with filename without extension', () => {
    it(`Lib.validate.extName('test') should return false`, (done) => {
      const answer = Lib.validate.extName('test')
      expect(answer).to.eql(false)
      done()
    })
  })

  describe('Test with filename with incorrect extension', () => {
    it(`Lib.validate.extName('test.pdf') should return false`, (done) => {
      const answer = Lib.validate.extName('test.pdf')
      expect(answer).to.eql(false)
      done()
    })
  })

  describe('Test with filename with correct extension', () => {
    it(`Lib.validate.extName('test.mp4') should return true`, (done) => {
      const answer = Lib.validate.extName('test.mp4')
      expect(answer).to.eql(true)
      done()
    })
  })

  describe('Test with filename with correct extension', () => {
    it(`Lib.validate.extName('test.webm') should return true`, (done) => {
      const answer = Lib.validate.extName('test.webm')
      expect(answer).to.eql(true)
      done()
    })
  })
})

describe('Test of Lib.make.randomString() with VidTest.isIdentical()', () => {
  describe('Tests the logic of this testing method', () => {
    it('VidTest.isIdentical(VidTest.notRandom, 2) should return true', (done) => {
      const result = VidTest.isIdentical(VidTest.notRandom, 2)
      expect(result).to.eql(true)
      done()
    })
  })

  describe('Even if called ten thousand times, strings should never be identical', () => {
    it('VidTest.isIdentical(Lib.make.randomString, 10000) should return false', (done) => {
      const result = VidTest.isIdentical(Lib.make.randomString, 10000)
      expect(result).to.eql(false)
      done()
    })
  })
})

describe('Test of Lib.make.indexArr() with VidTest.mockVideoObjArr()', () => {
  describe(`Tests that Lib.make.indexArr() returns an array
    with the same length as called with if limit is not exceeded`, () => {
    it(`Lib.make.indexArr(5, VidTest.mockVideoObjArr(4)) 
      should return an array with length 4`, (done) => {
      const result = Lib.make.indexArr(5, VidTest.mockVideoObjArr(4))
      expect(result.length).to.eql(4)
      done()
    })
  })

  describe(`Tests that Lib.make.indexArr() returns an array
    with the same length as the limit when limit is exceeded by 1`, () => {
    it(`Lib.make.indexArr(3, VidTest.mockVideoObjArr(4)) 
      should return an array with length 3`, (done) => {
      const result = Lib.make.indexArr(3, VidTest.mockVideoObjArr(4))
      expect(result.length).to.eql(3)
      done()
    })
  })
})
