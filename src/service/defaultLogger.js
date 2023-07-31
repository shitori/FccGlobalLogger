import path from 'path'
import { readFileSync } from 'fs'
import { readFile, unzipAndDistributeLines, zgrep } from '../helper/fileHelper'
import DefaultObject from '../model/defaultObject'

const MAX_TMP_FILES = 50

export default class DefaultLogger extends DefaultObject {
    constructor(logName) {
        super('log', `[${logName}]`)
        this.logName = logName
        this.logFullPath = path.join(__dirname, '..', '..', 'upload', logName)
        /*this.tmpFiles = []

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
        }*/

        this.alreadyInit = false // ? change at true for test faster

        //this.searchInDatabase()
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
                resolve('File already init')
            }
        })
    }

    getSubContentV0(filter) {
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

    async getSubContent(filter) {
        const lines = await zgrep(this.logFullPath, filter)
        return this.wrapContent(lines)

    }

    searchInDatabase() {
        const pathLog = path.join(
            __dirname,
            '..',
            '..',
            'database',
            `log-[${this.logName}].json`
        )

        let content = ''

        try {
            content = readFileSync(pathLog)
            console.info('Call found in database')
        } catch (error) {
            console.info('Call not found in database')
            return
        }

        const jsonContent = JSON.parse(content)

        this.alreadyInit = jsonContent.alreadyInit
        console.info('Load from database success')
    }


}
