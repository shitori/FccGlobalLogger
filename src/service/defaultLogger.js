import path from 'path'

const fs = require('fs')
const zlib = require('zlib')

export default class DefaultLogger {
    constructor(logName) {
        this.logName = logName
        this.content = this.readFile(logName)
    }

    readFile() {
        const fullPath = path.join(
            __dirname,
            '..',
            '..',
            'upload',
            this.logName
        )
        console.info(fullPath)
        const fileContent = fs.readFileSync(fullPath)
        const unzippedContent = zlib.unzipSync(fileContent).toString()
        const lines = unzippedContent.split('\n')
        return lines
    }
}
