'use strict'

/**
 * To configure web socket connection
 * @param {*} server - server to connect web socket to
 */
const socketConfig = (server) => {
  const io = require('socket.io')(server)

  // require other modules here
  // perhaps use promise wrappers
}

module.exports = socketConfig
