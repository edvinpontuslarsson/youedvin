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
const crypto = require('crypto')
const router = require('express').Router()
const Video = require('../../models/Video')
const csrf = require('csurf')
const csrfProtection = csrf()

const formidable = require('formidable')
const form = formidable.IncomingForm()

const Grid = require('gridfs-stream')
Grid.mongo = mongoose.mongo
const connection = mongoose.connection
const gfs = Grid(connection.db, mongoose.mongo)

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

    // saves video upload in DB
    // Inspired by pages 95-96 in the book "Web Development with Node & Express"
    // by Ethan Brown
    .post(csrfProtection, (req, res) => {
        if (!req.session.username) {
            res.status(403)
            res.render('error/403')
        } else {
            
            form.parse(req, async (err, fields, file) => {
                if (err) {
                    req.session.flash = {
                        type: 'error',
                        text: 'Something went wrong, please try again!'
                    }
                    res.redirect('/upload') 
                }

            /*
            console.log(fields.title)
            console.log(fields.description)*/
            console.log(file)
            

            const writeStream = gfs.createWriteStream({
                // I can in Lib.func generate random name myself
                // later, see Traversy also for extName
                filename: 'test.mp4'
            })

            fs.createReadStream(file).pipe(writeStream)

            const video = new Video({
                title: fields.title,
                description: fields.description,
                createdBy: req.session.username,
                creatorId: req.session.userid
            })

            await video.save()

            req.session.flash = {
                type: 'success',
                text: 'The Video has been succesfully uploaded!'
              }

            res.redirect('.')
            })
        }
    })

module.exports = router
