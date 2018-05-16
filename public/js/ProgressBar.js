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
        // Using a method inspired by: https://www.youtube.com/watch?v=EraNFJiY0Eg
        const file = this.fileField.files[0]
        const formData = new FormData()
        formData.append('fileField', file)

        req.upload.addEventListener('progress', makeProgress, false)

        req.send(formData)
    }
}

/**
 * Inspired by: https://www.youtube.com/watch?v=EraNFJiY0Eg
 */
const makeProgress = (event) => {
    showBar()
    const percentage = Math.floor((event.loaded / event.total) * 100)
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
    const div = document.importNode(
        template.content.firstElementChild, true
    )

    const section = document.getElementById('progressSection')
    section.appendChild(div)
}
