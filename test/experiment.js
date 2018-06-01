const path = require('path')

const test = 'test'

if (!path.extname(test)) {
    console.log('empty')
}
