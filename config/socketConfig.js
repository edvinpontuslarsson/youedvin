'use strict'

/**
 * To configure web socket connection
 * @param {*} server - server to connect web socket to
 */
const socketConfig = (server) => {
    const io = require('socket.io')(server)
}

module.exports = socketConfig
