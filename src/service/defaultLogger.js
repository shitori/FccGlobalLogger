import path from 'path'
import {
    readFile,
    unzipAndDistributeLines,
    unzipAndDistributeLinesV2,
} from '../helper/fileHelper'
import DefaultObject from '../model/defaultObject'

const MAX_TMP_FILES = 50

export default class DefaultLogger extends DefaultObject {
    constructor(logName) {
        super('log', `[${logName}]`)
        this.logName = logName
        this.logFullPath = path.join(__dirname, '..', '..', 'upload', logName)
        this.tmpFiles = []

        for (let index = 0; index < MAX_TMP_FILES; index += 1) {
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

        this.alreadyInit = false // ? change at true for test faster
    }

    init() {
        return new Promise((resolve, reject) => {
            if (!this.alreadyInit) {
                unzipAndDistributeLines(this.logFullPath, this.tmpFiles)
                    .then(() => {
                        this.alreadyInit = true
                        this.saveInDatabase()
                        resolve('File init OK')
                    })
                    .catch((err) => {
                        this.alreadyInit = false
                        this.saveInDatabase()
                        reject(new Error('File init KO', err))
                    })
            } else {
                this.saveInDatabase()
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
