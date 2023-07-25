import path from 'path'
import { readFile, unzipAndDistributeLines } from '../helper/fileHelper'

export default class DefaultLogger {
    constructor(logName) {
        this.logName = logName
        // this.content = this.readFile(logName)
        this.logFullPath = path.join(__dirname, '..', '..', 'upload', logName)
        this.tmpFiles = []
        this.alreadyInit = true
        for (let index = 0; index < 100; index += 1) {
            this.tmpFiles.push(
                path.join(
                    __dirname,
                    '..',
                    '..',
                    'tmp',
                    `${logName}-0${index}.txt`
                )
            )
        }
    }

    init() {
        return new Promise((resolve, reject) => {
            if (!this.alreadyInit) {
                unzipAndDistributeLines(this.logFullPath, this.tmpFiles)
                    .then(() => {
                        this.alreadyInit = true
                        resolve('File init OK')
                    })
                    .catch((err) => {
                        this.alreadyInit = false
                        reject(new Error('File init KO', err))
                    })
            } else {
                resolve('File already init')
            }
        })
    }

    getSubContent(filter) {
        return new Promise((resolve) => {
            this.init().then(() => {
                let res = []
                this.tmpFiles.forEach((file) => {
                    const content = readFile(file)
                    let subContent = content.filter((line) =>
                        line.includes(filter)
                    )
                    subContent = this.wrapContent(subContent)
                    res = res.concat(subContent)
                })

                res = res.sort((a, b) => a.dateTime - b.dateTime)
                resolve(res)
            })
        })
    }
}
