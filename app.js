/**
 * @author Edvin Larsson
 *
 * Starting point of the application
 *
 * @requires express
 * @requires express-session
 * @requires express-handlebars
 * @requires helmet
 * @requires path
 * @requires body-parser
 * @requires dotenv
 * @requires config/dbConfig
 * @requires routes/
 */

'use strict'

// for handling environment variables
require('dotenv').config()

const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const helmet = require('helmet')
const path = require('path')
const bodyParser = require('body-parser')

const app = express()
const port = process.env.PORT || 8080

// helmet, for protective HTTP headers
app.use(helmet())

// to only load content generated through my code
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'"]
  }
}))

// otherwise, too much information. No need to showcase that express is being used.
app.disable('x-powered-by')

// connects to DB
require('./config/dbConfig').dbConnect()

// View engine
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs'
}))
app.set('view engine', '.hbs')

// Parses incoming text data
app.use(bodyParser.urlencoded({
  extended: true
}))

// Sets path to the folder 'public' for static resources
app.use(express.static(path.join(__dirname, 'public')))

// Settings for session cookie
const sessionOptions = {
  name: process.env.CookieName,
  secret: process.env.CookieSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24
  }
}

app.use(session(sessionOptions))

// For flash messages
app.use((req, res, next) => {
  res.locals.flash = req.session.flash
  delete req.session.flash
  next()
})

// loads routes as "mini-apps"
app.use('/', require('./routes/home/home'))
app.use('/', require('./routes/user/logIn'))
app.use('/', require('./routes/user/logOut'))
app.use('/', require('./routes/user/signUp'))
app.use('/', require('./routes/video/upload'))
app.use('/', require('./routes/video/play'))
app.use('/', require('./routes/video/deleteVideo'))

/**
 * Defines route for 404 not found
 */
app.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})

/**
 * Handles errors
 */
app.use((err, req, res, next) => {
  if (err.status === 404) {
    res.status(404)
    return res.render('error/404')
    // return res.status(404).sendFile(path.join(__dirname, 'views', 'error', '404.html'))
  }
  console.log(err)

    // Unhandled errors render 500 error page
  return res.status(500).sendFile(path.join(__dirname, 'views', 'error', '500.html'))
})

// At start
app.listen(port, () => {
  console.log('The application is now running on port %s', port)
})

// for testing purposes
/*
const Lib = require('./lib/Lib')
const lib = new Lib()
console.log(lib.randomNrs())
*/
