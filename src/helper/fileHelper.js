import { writeFile as _writeFile, readFileSync } from 'fs'
import path from 'path'

const fs = require('fs')
const readline = require('readline')
const zlib = require('zlib')

export function writeFile(fileName, dataToWrite) {
    const fullPath = path.join(__dirname, '..', '..', 'database', fileName)
    return new Promise((resolve, reject) => {
        _writeFile(fullPath, dataToWrite, (err) => {
            if (err) {
                reject(new Error(err))
            } else {
                console.info(`${fullPath} saved`)
                resolve(fullPath)
            }
        })
    })
}

export function chunkBufferByLines(buffer, lineSeparator = '\n') {
    const lineChunks = []
    let start = 0
    let end = 0

    while ((end = buffer.indexOf(lineSeparator, start)) > -1) {
        lineChunks.push(buffer.slice(start, end).toString())
        start = end + lineSeparator.length
    }

    if (start < buffer.length) {
        lineChunks.push(buffer.slice(start).toString())
    }

    return lineChunks
}

export function unzipAndReturnLinesFile(filePath) {
    console.info(filePath)
    const fileContent = fs.readFileSync(filePath)
    const buffer = zlib.unzipSync(fileContent)

    const lineChunks = chunkBufferByLines(buffer, Buffer.from('\n', 'utf8'))
    return lineChunks
}

export function readFileFromUpload(fileName) {
    const fullPath = path.join(__dirname, '..', '..', 'upload', fileName)
    return unzipAndReturnLinesFile(fullPath)
}

export function readFile(fileName) {
    console.info(fileName)
    const fileContent = readFileSync(fileName)
    const lineChunks = chunkBufferByLines(
        fileContent,
        Buffer.from('\n', 'utf8')
    )
    return lineChunks
}

export function distributeLines(inputFile, outputFiles) {
    return new Promise((resolve, reject) => {
        // Create a ReadStream for the source file
        const inputStream = fs.createReadStream(inputFile)

        // Create WriteStreams for the destination files
        const outputStreams = outputFiles.map((file) =>
            fs.createWriteStream(file)
        )

        // Create a readline interface to read the source file line by line
        const rl = readline.createInterface({
            input: inputStream,
            crlfDelay: Infinity, // To handle both Unix and Windows line endings
        })

        let lineNumber = 0

        rl.on('line', (line) => {
            // Distribute the lines across the destination files in a round-robin fashion
            outputStreams[lineNumber % outputFiles.length].write(`${line}\n`)
            lineNumber += 1
        })

        rl.on('close', () => {
            // Close all the files after reading is complete
            outputStreams.forEach((stream) => stream.end())
            resolve()
        })

        rl.on('error', (err) => {
            // If there is an error, reject the Promise
            reject(err)
        })
    })
}

export function unzipAndDistributeLines(zipFile, outputFiles) {
    return new Promise((resolve, reject) => {
        // Create WriteStreams for the destination files
        const outputStreams = outputFiles.map((file) =>
            fs.createWriteStream(file)
        )

        // Create a zlib Gzip object to unzip the file
        const gunzip = zlib.createGunzip()

        const rl = readline.createInterface({
            input: fs.createReadStream(zipFile).pipe(gunzip), // Pipe the unzipped data directly to the readline interface
            crlfDelay: Infinity, // To handle both Unix and Windows line endings
        })

        let lineNumber = 0

        rl.on('line', (line) => {
            // Distribute the lines across the destination files in a round-robin fashion
            outputStreams[lineNumber % outputFiles.length].write(`${line}\n`)
            lineNumber += 1
        })

        rl.on('close', () => {
            // Close all the files after reading is complete
            outputStreams.forEach((stream) => stream.end())
            resolve()
        })

        rl.on('error', (err) => {
            // If there is an error, reject the Promise
            reject(err)
        })
    })
}
