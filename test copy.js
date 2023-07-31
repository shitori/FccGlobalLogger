const fs = require('fs')
const zlib = require('zlib')
const readline = require('readline')

function zgrep(filePath, searchTerm, callback) {
    const readStream = fs.createReadStream(filePath)
    const gunzipStream = zlib.createGunzip()
    const rl = readline.createInterface({
        input: gunzipStream,
        crlfDelay: Infinity,
    })

    let lineNumber = 0

    rl.on('line', (line) => {
        lineNumber++
        if (line.includes(searchTerm)) {
            callback(line, lineNumber)
        }
    })

    rl.on('close', () => {
        callback(null, lineNumber)
    })

    readStream.pipe(gunzipStream)
}

// Example usage:
const filePath = './upload/haproxy_debug.log-20230627lblout.gz'
const searchTerm = 'cf4f38382fba9ca5d4f067e3619a5175507f65a7600ceae480'

zgrep(filePath, searchTerm, (result, lineNumber) => {
    if (result) {
        console.log(`Found at line ${lineNumber}: ${result}`)
    } else {
        console.log(`Search completed. Total lines processed: ${lineNumber}`)
    }
})
