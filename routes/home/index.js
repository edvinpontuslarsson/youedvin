/**
 * @module home.js
 * @author Edvin Larsson
 *
 * Route for the home page
 *
 * @requires express
 */

'use strict'

const router = require('express').Router()
const VideoLib = require('../../lib/VideoLib')
const videoLib = new VideoLib()

// later replace all twos with 20, almost

// and all threes with 21

router.route('/')
    .get(async (req, res) => { 
      // query for 1 more than to be displayed,
      // to check if new page is needed 
      const videoInfo = await videoLib.getSomeVideoInfo(
            req, res, 3, 0
      )

      const addPage = true ? videoInfo.length > 2 : false

      const videoArr = videoLib.makeIndexArr(2, videoInfo)

      res.status(200)
      res.render('home/index', {
        videoArr, addPage, nextPage: 2
      })
    })

router.route('/index/:id')
    .get(async (req, res) => {

      // put this logic into func and test

      const currentPage = parseInt(req.params.id)
      const prevPage = currentPage - 1
      let nextPage = currentPage + 1

      // how many to skip, depending on how many per page
      const skip = prevPage * 2

      // query for 1 more than to be displayed,
      // to check if new page is needed 
      const videoInfo = await videoLib.getSomeVideoInfo(
        req, res, 3, skip
      )

      if (videoInfo.length < 3) {
        nextPage = false
      }

      if (videoInfo.length < 1) {
        res.status(404)
        res.render('error/404')
      } else {
        const videoArr = videoLib.makeIndexArr(2, videoInfo)

        res.status(200)
        res.render('home/index', {
          videoArr, addPage: true, prevPage, nextPage
        })
      }
    }) 

module.exports = router
