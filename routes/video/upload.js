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
 * @requires gridfs-stream
 * @requires fs
 */

'use strict'

const fs = require('fs')
const router = require('express').Router()
const Video = require('../../models/Video')
const Grid = require('gridfs-stream')
const csrf = require('csurf')
const csrfProtection = csrf()

const formidable = require('formidable')
const form = formidable.IncomingForm()

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
    .post(csrfProtection, async (req, res) => {
        if (!req.session.username) {
            res.status(403)
            res.render('error/403')
        } else {
            
            form.parse(req, (err, fields, file) => {
                if (err) {
                    req.session.flash = {
                        type: 'error',
                        text: 'Something went wrong, please try again!'
                    }
                    res.redirect('/upload') 
                }

            console.log(fields.title)
            console.log(fields.description)
            console.log(file)

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
