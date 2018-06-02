const fsDAO = require('./models/fsDAO')

;(async () => {
    const filePath = './uploads/videoAmount.json'
    const jsonVAmount = await fsDAO.getFile(filePath)
    const vAmount = JSON.parse(jsonVAmount)
    vAmount.count += 1
    const update = JSON.stringify(vAmount)
    fsDAO.putFile(filePath, update)
})()
