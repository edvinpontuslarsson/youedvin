'use strict'

const VideoInfo = require('../../models/VideoInfo')

const edit = {
    /**
     * Updates video info
     */
    videoInfo: (id, title, description) => {
        return new Promise((resolve, reject) => {
            VideoInfo.findById(id, (err, data) => {
                if (err) { reject(err) }

                data.title = title
                data.description = description               

                data.save(callback)
            })
        })
    }
}

module.exports = edit
