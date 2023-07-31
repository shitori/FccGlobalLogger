import { writeFile as _writeFile, readFileSync } from 'fs'
import path from 'path'

const fs = require('fs')
const readline = require('readline')
const zlib = require('zlib')
const os = require('os')
const {
    Worker,
    isMainThread,
    parentPort,
    workerData,
} = require('worker_threads')

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

export function unzipAndDistributeLinesV2(zipFile, outputFiles) {
    return new Promise((resolve, reject) => {
        const outputStreams = outputFiles.map((file) =>
            fs.createWriteStream(file)
        )

        const gunzip = zlib.createGunzip()
        const rl = readline.createInterface({
            input: fs.createReadStream(zipFile).pipe(gunzip),
            crlfDelay: Infinity, // To handle both Unix and Windows line endings
        })

        // Number of CPU cores available
        const numCores = os.cpus().length
        const workers = []

        function createWorker() {
            const worker = new Worker(__filename)
            worker.on('message', (line) => {
                outputStreams[line.index % outputFiles.length].write(
                    `${line.content}\n`
                )
            })
            worker.on('error', (err) => {
                reject(err)
            })
            worker.on('exit', () => {
                if (workers.length > 0) {
                    createWorker()
                } else {
                    outputStreams.forEach((stream) => stream.end())
                    resolve()
                }
            })
            workers.push(worker)
        }

        let lineNumber = 0
        let workerIndex = 0

        rl.on('line', (line) => {
            workers[workerIndex].postMessage({
                content: line,
                index: lineNumber,
            })
            lineNumber++
            workerIndex = (workerIndex + 1) % numCores
        })

        rl.on('close', () => {
            workers.forEach((worker) => worker.postMessage({ exit: true }))
        })

        rl.on('error', (err) => {
            reject(err)
        })

        // Start creating worker threads
        for (let i = 0; i < numCores; i++) {
            createWorker()
        }
    })
}

if (!isMainThread) {
    const { content, index, exit } = workerData

    if (exit) {
        process.exit()
    }

    parentPort.postMessage({ content, index })
}

export async function zgrep(filePath, searchTerm) {
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
