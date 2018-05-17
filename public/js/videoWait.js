'use strict'

/**
 * @param {Element} id - id of HTML-element
 * @returns HTML-element
 */
const _ = id => document.getElementById(id)

/**
 * When the video can play through without buffering
 */
;(() => {
    const clip = _('videoClip')
    clip.addEventListener('canplaythrough', () => {
        showClip()
    })
})()

/**
 * Hides waiting message & displays video clip
 */
const showClip = () => {
    const section = _('videoSection')
    section.removeChild(section.firstElementChild)
}
