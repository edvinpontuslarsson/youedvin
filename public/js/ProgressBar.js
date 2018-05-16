'use strict'

class ProgressBar {
    constructor () {
        this.button = document.getElementById('uploadBtn')
    }

    /**
     * Initializes an instance of ProgressBar class
     */
    instance () {
        const progressBar = new ProgressBar()
        return progressBar
    }

    click() {
        this.button.addEventListener('click', () => {
            // call function
        })
    }
}

// Initializes ProgressBar instance
ProgressBar.instance()
