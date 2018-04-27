/**
 * @module home.js
 * @author Edvin Larsson
 *
 * Route for index pages
 *
 * @requires express
 */

'use strict'

const router = require('express').Router()
const Lib = require('../../lib/Lib')

// limit of videolinks to be displayed per page
const limit = 2

// query for 1 more than to be displayed,
// to check if new page is needed 
const query = limit + 1

router.route('/')
    .get(async (req, res) => {  
      const videoInfo = await Lib.get.newestVideos(
            req, res, query, 0
      )

      const addPage = true ? videoInfo.length > limit : false

      const videoArr = Lib.make.indexArr(limit, videoInfo)

      res.status(200)
      res.render('home/index', {
        videoArr, addPage, nextPage: limit
      })
    })

router.route('/index/:id')
    .get(async (req, res) => {      
      const currentPage = parseInt(req.params.id)

      if (isNaN(currentPage)) {
        res.status(404)
        return res.render('error/404')
      }

      // Lib.calc.pagination()

      const prevPage = currentPage - 1
      let nextPage = currentPage + 1

      // how many to skip, depending on how many per page
      const skip = prevPage * limit

      // query for 1 more than to be displayed,
      // to check if new page is needed 
      const videoInfo = await Lib.get.newestVideos(
        req, res, query, skip
      )

      // if there should be a next page or not
      if (videoInfo.length <= limit) {
        nextPage = false
      }

      if (videoInfo.length < 1) {
        res.status(404)
        res.render('error/404')
      } else {
        const videoArr = Lib.make.indexArr(limit, videoInfo)

        res.status(200)
        res.render('home/index', {
          videoArr, addPage: true, prevPage, nextPage
        })
      }
    }) 

module.exports = router
