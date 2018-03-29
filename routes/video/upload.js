/**
 * @module upload
 * @author Edvin Larsson
 * 
 * Route for uploading videos
 * 
 * @requires express
 * @requires Video
 * @requires csurf
 * @requires formidable
 * @requires mongoose
 * @requires gridfs-stream
 * @requires fs
 */

'use strict'

const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const router = require('express').Router()
const Lib = require('../../lib/Lib')
const lib = new Lib()

// const Video = require('../../models/Video')

const multer = require('multer')

// see more in this module
const GridFsStorage = require('multer-gridfs-storage')

const Grid = require('gridfs-stream')
const connection = mongoose.connection

const csrf = require('csurf')
const csrfProtection = csrf()

/*
const formidable = require('formidable')
const form = formidable.IncomingForm()
*/

router.route('/upload')
    // renders upload form, only for logged in users
    .get(csrfProtection, (req, res) => {
        if (!req.session.username) {
            res.status(403)
            res.render('error/403')
        } else {
            res.render('video/upload', {
                csrfToken: req.csrfToken()
            })
        }
    })

    // saves video to DB, only for logged in users
    .post(csrfProtection, (req, res) => {
        if (!req.session.username) {
            res.status(403)
            res.render('error/403')
        } else {
            // inspired by this demo: https://www.youtube.com/watch?v=3f5Q9wDePzY
            const gfs = Grid(connection.db, mongoose.mongo)
            gfs.collection('video')

            // using this similarly to their documentation:
            // https://www.npmjs.com/package/multer-gridfs-storage
            const storage = new GridFsStorage({
                url: process.env.dbURL,
                file: (req, file) => {
                    return new Promise((res, rej) => {

                        // for security reasons, I change the name of the file
                        const fileName = lib.randomNrs() + 
                        path.extname(file.originalname)

                        
                    })
                }
            })

            req.session.flash = {
                type: 'success',
                text: 'The Video has been succesfully uploaded!'
              }

            res.redirect('.')
        }
    })

module.exports = router
