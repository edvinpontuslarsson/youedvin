'use strict'

const getTitleTxt = () => document
    .getElementsByTagName('title')[0]
    .innerHTML

const getURL = () =>
    window.location.href

const getImgUrl = () => {
    const pathName = window.location.pathname
    const iOfLastDash = pathName.lastIndexOf('/')
    const iOfEndingDot = pathName.indexOf('.')
    
    const imgName = pathName.slice(
        iOfLastDash + 1,
        iOfEndingDot
    )

    const imgUrl =
        `https://youedvin.com/uploads/thumbnails/${imgName}-thumbnail-320x240-0001.png`

    return imgUrl
}

const getHeadElement = () => document
    .getElementsByTagName('head')[0]

const makeOgTagString = (url, title, img) => 
    `
    <meta property="og:title" content="YouEdvin" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${img}" />
    <meta property="og:description" 
        content="${title}" />
    `
    

const addOgTagsToHead = (opgTagString, head) => {
    head.innerHTML += opgTagString
}

;(() => {
    const ogTagString = makeOgTagString(
        getURL(),
        getTitleTxt(),
        getImgUrl()
    )

    addOgTagsToHead(
        ogTagString,
        getHeadElement()
    )
})()
