'use strict'

;(() => {
    const button = document.getElementById('uploadBtn')
    button.addEventListener('click', () => {
        upload()
    })
})()

/**
 * 
 */
const upload = () => {
    const req = new XMLHttpRequest()
    const fileField = document.getElementById('fileField')

    // if a file has been uploaded
    if (fileField.files.length > 0) {
        makeProgress(fileField.files[0])
    }
}

/**
 * Inspired by: 
 * https://www.webcodegeeks.com/javascript/node-js/node-js-file-upload-progress-bar-example/
 * and:
 * https://www.youtube.com/watch?v=EraNFJiY0Eg
 */
const makeProgress = (file) => {
    showBar()
    const req = new XMLHttpRequest()
    req.upload.addEventListener('progress', displayProgress)
    req.open('POST', '/')


    const percentage = Math.floor((file.loaded / file.total) * 100)
    const bar = document.getElementById('progressBar')
    const status = document.getElementById('uploadStatus')
    bar.value = percentage
    status.innerHTML = `${percentage} % uploaded...`
}

/**
 * Puts progress bar in view
 */
const showBar = () => {
    const template = document.getElementById('progressTemplate')
    const paragraph = document.importNode(template.content.firstElementChild, true)

    const section = document.getElementById('progressSection')
    section.appendChild(paragraph)
}

const displayProgress = () => {

}
