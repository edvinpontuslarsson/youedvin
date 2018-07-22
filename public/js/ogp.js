'use strict'

const getTitleTxt = () => document
    .getElementsByTagName('title')[0]
    .innerHTML

const getURL = () =>
    window.location.href

const getHeadElement = () => document
    .getElementsByTagName('head')[0]

const makeOpgTagString = (url, title, img) => 
    `
    <meta property="og:title" content="${title}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${img}" />
    `
    

const addOpgTagsToHead = (opgTagString, head) => {
    head.innerHTML += opgTagString
}

;(() => {
    const opgTagString = makeOpgTagString(
        getURL(),
        getTitleTxt(),
        'https://youedvin.com/img/icons/search.png'
    )

    addOpgTagsToHead(
        opgTagString,
        getHeadElement()
    )

    const head = getHeadElement()
    console.log(
        head.innerHTML
    )
})()
