const fs = require('fs')
const zlib = require('zlib')
const readline = require('readline')

async function zgrep(filePath, searchTerm) {
    const gunzip = zlib.createGunzip()
    const readStream = fs.createReadStream(filePath).pipe(gunzip)
    const rl = readline.createInterface({
        input: readStream,
        crlfDelay: Infinity,
    })

    const matchedLines = []

    for await (const line of rl) {
        if (line.includes(searchTerm)) {
            matchedLines.push(line)
        }
    }

    return matchedLines
}

async function main() {
    // Example usage:
    const filePath = './upload/haproxy_debug.log-20230627lblout.gz'
    const searchTerm = 'cf4f38382fba9ca5d4f067e3619a5175507f65a7600ceae480'
    try {
        const matchedLines = await zgrep(filePath, searchTerm);
        console.log('Matched lines:', matchedLines);
        console.log('Total matches:', matchedLines.length);
    } catch (error) {
        console.error('Error occurred:', error);
    }
}

main()

/*(async () => {
    try {
        const filePath = './upload/haproxy_debug.log-20230627lblout.gz'
        const searchTerm = 'cf4f38382fba9ca5d4f067e3619a5175507f65a7600ceae480'

        const matchedLines = await zgrep(filePath, searchTerm)
        console.info('Matched lines:', matchedLines)
        console.info('Total matches:', matchedLines.length)
    } catch (error) {
        console.error('Error occurred:', error)
    }
})()*/