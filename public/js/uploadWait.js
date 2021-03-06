'use strict'

/**
 * @param {Element} id - id of HTML-element
 * @returns HTML-element
 */
const _ = id => document.getElementById(id)

// When file is uploaded
;(() => {
  const button = _('uploadBtn')
  button.addEventListener('click', () => {
    pleaseWait()
  })
})()

/**
 * Hides upload form & displays waiting message
 */
const pleaseWait = () => {
  const form = _('uploadForm')
  form.classList.add('hidden')

  const template = _('uploadingTemplate')
  const message = document.importNode(template.content.firstElementChild, true)

  const section = _('uploadWait')
  section.appendChild(message)
}
