/**
 * Delete video route
 */

'use strict'

const router = require('express').Router()
const mongoose = require('mongoose')
const VideoInfo = require('../../models/VideoInfo')
const fsDAO = require('../../models/fsDAO')
const Lib = require('../../lib/Lib')

router.route('/delete/:id')

  // for rendering delete video form
  .get(async (req, res) => {
    const video = await Lib.get.aVideo(req.params.id)

    if (video === null) {
      res.status(404)
      return res.render('error/404')
    }

    if (video.creatorId !== req.session.userid) {
      res.status(403)
      res.render('error/403')
    } else {
      res.render('video/delete', {
        id: req.params.id,
        title: video.title
      })
    }
  })

  // to delete video
  .post(async (req, res) => {
    const fileName = req.params.id
    const video = await Lib.get.aVideo(fileName)

    if (video.creatorId !== req.session.userid) {
      res.status(403)
      res.render('error/403')
    } else {
      const filePath = `./public/uploads/videos/${fileName}`

      // deletes video file
      await fsDAO.deleteFile()

      // deletes video info
      await VideoInfo.findOneAndRemove({
        fileName: fileName
      })

      // updates video amount
    }
  })

module.exports = router
