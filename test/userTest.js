'use strict'

const expect = require('chai').expect
const Lib = require('../lib/Lib')

describe('Test of Lib.validate.registration()', () => {
  describe('Test with too short password', () => {
    it(`Lib.validate.registration('username', 'pass', 'pass', null) should
        return okay: false, expected message & status 400`, (done) => {
      const reply = Lib.validate.registration('username', 'pass', 'pass', null)
      expect(reply.okay).to.eql(false)
      expect(reply.message).to.eql('The password needs to be at least 5 characters long')
      expect(reply.status).to.eql(400)
      done()
    })
  })

  describe('Test with non-matching passwords', () => {
    it(`Lib.validate.registration('username', 'password', 'banana', null) should
        return okay: false, expected message & status 400`, (done) => {
      const reply = Lib.validate.registration('username', 'password', 'banana', null)
      expect(reply.okay).to.eql(false)
      expect(reply.message).to.eql('The passwords do not match')
      expect(reply.status).to.eql(400)
      done()
    })
  })

  describe('Test where fourth parameter is not null', () => {
    it(`Lib.validate.registration('username', 'password', 'password', 'not-null') should
        return okay: false, expected message & status 409`, (done) => {
      const reply = Lib.validate.registration('username', 'password', 'password', 'not-null')
      expect(reply.okay).to.eql(false)
      expect(reply.message).to.eql('The username is already taken, please choose a different one!')
      expect(reply.status).to.eql(409)
      done()
    })
  })

  describe('Test with requirements fulfilled', () => {
    it(`Lib.validate.registration('username', 'password', 'password', null) should
        return okay: true, expected message & status 200`, (done) => {
      const reply = Lib.validate.registration('username', 'password', 'password', null)
      expect(reply.okay).to.eql(true)
      expect(reply.message).to.eql('Good to go!')
      expect(reply.status).to.eql(200)
      done()
    })
  })
})
