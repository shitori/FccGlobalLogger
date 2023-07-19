import { writeFile as _writeFile } from 'fs'
import path from 'path'

export default function writeFile(fileName, dataToWrite) {
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
