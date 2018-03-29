/**
 * General help functions
 */
class Lib {
    /**
     * Generates a string of random numbers
     */
    randomNrs () {
        let nrString = ''

        for (let i = 0; i < 15; i += 1) {
            let randNr = Math.floor((Math.random() * 10) + 1)
            nrString += randNr.toString()
        }

        return nrString
    } 
}

module.exports = Lib
