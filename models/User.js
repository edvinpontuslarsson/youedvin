/**
 * Defines DB storage of users
 */

'use strict'

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

// Defines schema
const userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
})

// Validates password
userSchema.path('password').validate((password) => {
  return password.length >= 5
}, 'The password must be at least 5 characters long.')


// Salts and hashes password before saving it to DB
userSchema.pre('save', function (next) {
  const user = this
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err)
    }

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) {
        return next(err)
      }
      user.password = hash
      next()
    })
  })
})

// Validates the password the user tries to log in with
userSchema.methods.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function (err, result) {
    if (err) {
      return callback(err)
    }
    // result === boolean
    callback(null, result)
  })
}

// Creates the model object
const User = mongoose.model('User', userSchema)

module.exports = User
