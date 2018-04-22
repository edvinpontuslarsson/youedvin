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
      // limit of videolinks to be displayed per page
      const limit = 2

      // query for 1 more than to be displayed,
      // to check if new page is needed 
      const query = limit + 1
      
      const videoInfo = await videoLib.getSomeVideoInfo(
            req, res, query, 0
      )

      const addPage = true ? videoInfo.length > limit : false

      const videoArr = videoLib.makeIndexArr(limit, videoInfo)

      res.status(200)
      res.render('home/index', {
        videoArr, addPage, nextPage: limit
      })
    })

router.route('/index/:id')
    .get(async (req, res) => {
      const limit = 2

      // query for 1 more than to be displayed,
      // to check if new page is needed 
      const query = limit + 1
      
      const currentPage = parseInt(req.params.id)
      const prevPage = currentPage - 1
      let nextPage = currentPage + 1

      // how many to skip, depending on how many per page
      const skip = prevPage * limit

      // query for 1 more than to be displayed,
      // to check if new page is needed 
      const videoInfo = await videoLib.getSomeVideoInfo(
        req, res, query, skip
      )

      // if there should be a next page or not
      if (videoInfo.length < limit) {
        nextPage = false
      }

      if (videoInfo.length < 1) {
        res.status(404)
        res.render('error/404')
      } else {
        const videoArr = videoLib.makeIndexArr(limit, videoInfo)

        res.status(200)
        res.render('home/index', {
          videoArr, addPage: true, prevPage, nextPage
        })
      }
    }) 

module.exports = router
