/**
 * Delete video route
 */

'use strict'

const router = require('express').Router()
const sanitize = require('mongo-sanitize')
const VideoInfo = require('../../models/VideoInfo')
const VideoAmount = require('../../models/VideoAmount')
const fsDAO = require('../../models/fsDAO')
const Lib = require('../../lib/Lib')

router.route('/delete/:id')

  // for rendering delete video form
  .get(async (req, res) => {
    const fileName = sanitize(req.params.id)
    const video = await Lib.get.aVideo(fileName)

    if (video === null) {
      res.status(404)
      return res.render('error/404')
    }

    if (video.creatorId !== req.session.userid) {
      res.status(403)
      res.render('error/403')
    } else {
      res.render('video/delete', {
        id: fileName,
        title: video.title
      })
    }
  })

  // to delete video
  .post(async (req, res) => {
    const fileName = sanitize(req.params.id)
    const video = await Lib.get.aVideo(fileName)

    if (video.creatorId !== req.session.userid) {
      res.status(403)
      res.render('error/403')
    } else {
      const filePath = `./public/uploads/videos/${fileName}`

      // deletes video file
      await fsDAO.deleteFile(filePath)

      // deletes video info
      await VideoInfo.findOneAndRemove({
        fileName: fileName
      })

      // updates video amount
      const videoAmount = await VideoAmount.findOne({
        name: 'VideoAmount'
      })
      videoAmount.amount -= 1
      await videoAmount.save()

      req.session.flash = {
        type: 'success',
        text: 'The Video has been succesfully deleted.'
      }
      res.redirect('/')
    }
  })

module.exports = router
