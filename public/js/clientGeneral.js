'use strict'

// don't have too many client side JS files

console.log('hello?')

const button = document.getElementById('testingForm')

    button.addEventListener('click', () => {
        console.log('Triggered!')
        window.stop()
    })
