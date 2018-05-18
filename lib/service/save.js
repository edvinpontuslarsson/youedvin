'use strict'

const fs = require('fs')
const formidable = require('formidable')
const path = require('path')
const Lib = require('../../lib/Lib')

const save = {

    // if I can't make this work
    // take a look at this: https://medium.com/@ShiyaLuo/simple-file-upload-with-express-js-and-formidable-in-node-js-d734d248d615

    /**
     * Inspired by method described here: https://www.w3schools.com/nodejs/nodejs_uploadfiles.asp
     * @param req -needed
     * @returns file name as promise
     */
    file: (req) => {
        return new Promise ((resolve, reject) => {
            const form = new formidable.IncomingForm()
            form.parse(req, (error, fields, files) => {
                const originalName = files.filetoupload.name
                if (Lib.validate.extName(originalName) === false) {
                    return reject(new Error('Upload attempt with unsupported file format'))
                }
                const fileName = `${Lib.make.randomString()}${path.extname(originalName)}`

                const tempPath = files.filetoupload.path
                const permPath = `/public/videos/${fileName}`                

                fs.rename(tempPath, permPath, (err) => {
                    if (err) {
                        return reject(new Error('Upload failed'))
                    }

                    // if all is well
                    resolve(fileName)
                })
            })
        })
    }
}

module.exports = save
