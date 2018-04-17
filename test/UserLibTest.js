'use strict'

const expect = require('chai').expect
const UserLib = require('../lib/UserLib')
const userLib = new UserLib()

describe('Test of signUpValidation()', () => {
    describe('Test with too short password', () => {
        it(`signUpValidation('username', 'pass') should
        return okay: false, expected message & status 400`, (done) => {
            const reply = userLib.signUpValidation('username', 'pass')
            expect(reply.okay).to.eql(false)
            expect(reply.message).to.eql('The password needs to be at least 5 characters long')
            expect(reply.status).to.eql(400)
            done()
        })    
    })

    describe('Test with non-matching passwords', () => {
        it(`signUpValidation('username', 'password', 'banana') should
        return okay: false, expected message & status 400`, (done) => {
            const reply = userLib.signUpValidation('username', 'password', 'banana')
            expect(reply.okay).to.eql(false)
            expect(reply.message).to.eql('The passwords do not match')
            expect(reply.status).to.eql(400)
            done()
        })    
    })

    describe('Test with pre-existing username', () => {
        it(`signUpValidation('username', 'password', 'password', 'not-null') should
        return okay: false, expected message & status 409`, (done) => {
            const reply = userLib.signUpValidation('username', 'password', 'password', 'not-null')
            expect(reply.okay).to.eql(false)
            expect(reply.message).to.eql('The username is already taken, please choose a different one!')
            expect(reply.status).to.eql(409)
            done()
        })    
    })

    describe('Test with requirements fulfilled', () => {
        it(`signUpValidation('username', 'password', 'password', null) should
        return okay: true, expected message & status 200`, (done) => {
            const reply = userLib.signUpValidation('username', 'password', 'password', null)
            expect(reply.okay).to.eql(true)
            expect(reply.message).to.eql('Good to go!')
            expect(reply.status).to.eql(200)
            done()
        })    
    })
})
