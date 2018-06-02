/**
 * For handling file system
 */

'use strict'

const fs = require('fs')

/**
 * Object with functions
 */
const fsDAO = {
    /**
     * 
     * 
     */
    getFile: (filePath) => {
        return new Promise ((resolve, reject) => {
            fs.readFile(filePath, (err, file) => {
                if (err) { throw err }

                resolve(file)
            })
        })
    },

    putFile: (buffer, filePath) => {

    },


    deleteFile: (filePath) => {
        
    }
}

module.exports = fsDAO
