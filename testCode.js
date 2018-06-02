const fsDAO = require('./models/fsDAO')

;(async () => {
    const jsonVAmount = await fsDAO.getFile('./uploads/videoAmount.json')
    const vAmount = JSON.parse(jsonVAmount)
    vAmount.count += 1
    console.log(vAmount)
})()
