/**
 * Starting point of the application
 */

'use strict'

const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const helmet = require('helmet')
const csrf = require('csurf')
const path = require('path')
const bodyParser = require('body-parser')

// environment variables
require('dotenv').config()

// connects to DB
require('./config/dbConfig').dbConnect()

// ==============================================
//  EXPRESS CONFIG
// ==============================================

// initializes express app
const app = express()

// helmet, for protective HTTP headers
app.use(helmet())

// to only load content generated through my code
app.use(helmet.contentSecurityPolicy({
  directives: {
    connectSrc: ["'self'"],
    defaultSrc: ["'self'"],
    styleSrc: ["'self'"]
  }
}))

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

// Directs to the folder 'public' for static resources
app.use(express.static(path.join(__dirname, 'public')))

// ==============================================
//  SESSION CONFIG
// ==============================================

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

// To trust proxy and make cookies secure in production mode
if (process.env.Environment === 'production') {
  app.set('trust proxy', 1)
  sessionOptions.cookie.secure = true
}

// sets cookie settings
app.use(session(sessionOptions))

// for csrf-protection
app.use(csrf())

// config for updating html
app.use(async (req, res, next) => {
  // for flash messages
  res.locals.flash = req.session.flash
  delete req.session.flash

  // updates header menu for logged in users
  res.locals.username = req.session.username

  // sets value to hidden csrf-tokens in forms
  res.locals.csrfToken = req.csrfToken()

  next()
})

// ==============================================
//  ROUTES CONFIG
// ==============================================

// requires all routes
app.use('/', require('./routes/index/index'))
app.use('/', require('./routes/index/search'))
app.use('/', require('./routes/user/logIn'))
app.use('/', require('./routes/user/logOut'))
app.use('/', require('./routes/user/signUp'))
app.use('/', require('./routes/user/userEdit'))
app.use('/', require('./routes/user/passEdit'))
app.use('/', require('./routes/video/upload'))
app.use('/', require('./routes/video/play'))
app.use('/', require('./routes/video/surprise'))
app.use('/', require('./routes/video/deleteVideo'))
app.use('/', require('./routes/video/editVideo'))

// Defines route for 404 not found
app.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})

// ==============================================
//  ERROR CONFIG
// ==============================================

app.use((err, req, res, next) => {
  if (err.status === 404) {
    res.status(404)
    return res.render('error/404')
  }

  // For invalid csrf-tokens
  if (err.code === 'EBADCSRFTOKEN') {
    req.session.flash = {
      type: 'error',
      text: 'Something went wrong'
    }
    res.status(500)
    return res.redirect('/')
  }

  // For failed file upload attempts
  if (err.message === 'Upload attempt with unsupported file format') {
    req.session.flash = {
      type: 'error',
      text: 'Unsupported file format'
    }
    res.status(400)
    return res.redirect('/upload')
  }

  // For file upload posts from non-authenticated users
  if (err.message === 'Unauthorized file upload attempt') {
    res.status(403)
    return res.render('error/403')
  }

  console.log(err)

  // Unhandled errors render 500 error page
  return res.status(500).sendFile(path.join(__dirname, 'views', 'error', '500.html'))
})

// ==============================================
//  LIFT OFF!
// ==============================================

const port = process.env.PORT

app.listen(port, () => {
  console.log(`The application is now running on port ${port}`)
})
