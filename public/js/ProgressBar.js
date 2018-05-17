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
 */
const makeProgress = (file) => {
    showBar()
    const req = new XMLHttpRequest()
    const csrf = document.getElementById('csrfToken')
    const token = csrf.value
    req.open('POST', `/upload?_csrf=${token}`)
    req.upload.addEventListener('progress', displayProgress)

    const formData = new FormData()
    formData.append('video', file[0])
    req.send(formData)
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

/**
 * Inspired by:
 * https://www.youtube.com/watch?v=EraNFJiY0Eg
 * @param {file} event - file upload
 */
const displayProgress = (event) => {
    const percentage = Math.floor((event.loaded / event.total) * 100)
    const bar = document.getElementById('progressBar')
    const status = document.getElementById('uploadStatus')
    bar.value = percentage
    status.innerHTML = `${percentage} % uploaded... Please wait`
}
