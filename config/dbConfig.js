/**
 * Database configuration with Mongoose
 */

'use strict'

const mongoose = require('mongoose')
require('dotenv').config()

module.exports = {
  /**
   * For connecting to database
   * Inspired by demo code in the course 1dv023
   * https://github.com/1dv023/syllabus/tree/master/lectures/03/demo
   */
  dbConnect: () => {
    const db = mongoose.connection

    db.on('error', console.error.bind(console, 'connection error:'))

    db.once('open', () => {
      console.log('Connected to DB')
    })

    process.on('SIGINT', () => {
      db.close(() => {
        console.log('DB connection closed')
        process.exit(0)
      })
    })

    mongoose.connect(process.env.dbURL)
  }
}
