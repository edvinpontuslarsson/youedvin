'use strict'

/**
 * Adds css class to push the footer down to the bottom of the page
 * if the page content doesn't cover the whole page
 * Inspired by: https://gomakethings.com/how-to-test-if-an-element-is-in-the-viewport-with-vanilla-javascript/
 */
;(() => {
    console.log('hello')
    const footer = document.getElementById('mainFooter')

    const position = footer.getBoundingClientRect()

    if (position.top >= 0 &&
        position.bottom <= window.innerHeight ||
        position.bottom <= document.documentElement.clientHeight) {
            console.log('Mkay')
            footer.classList.add('getDown')
        }
})()


/*
if (footer.scrollHeight > footer.clientHeight) {
    console.log('Mkay')
    footer.classList.add('getDown')
}*/
