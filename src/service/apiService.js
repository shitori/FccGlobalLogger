import { readFile, unzipAndReturnLinesFile } from '../helper/fileHelper'
import ApiLine from '../model/apiLine'
import DefaultLogger from './defaultLogger'

export default class ApiService extends DefaultLogger {
    constructor(logName) {
        super(logName)
        this.contentWrap = this.wrapContent()
    }

    wrapContent() {
        const wraped = []
        const content = unzipAndReturnLinesFile(this.logFullPath)
        console.info(content)
        content.forEach((line) => {
            wraped.push(new ApiLine(line))
        })
        const wrapedConcatError = []
        let index = 0
        wraped.forEach((line) => {
            if (line.message === '') {
                wrapedConcatError[index - 1].message += `\n${line.LogLine}`
            } else {
                wrapedConcatError[index] = line
                index += 1
            }
        })
        return wrapedConcatError
    }

    getApiLogFromAgent(agentLogin) {
        const subContent = this.contentWrap.filter(
            (lineW) =>
                lineW.message.includes(agentLogin) ||
                lineW.agentLogin.includes(agentLogin)
        )
        return subContent
    }

    getApiLogFromAgentAndDateTime(agentLogin, dateStart, dateEnd) {
        let subContent = this.getApiLogFromAgent(agentLogin)
        console.info(subContent)
        subContent = subContent.filter(
            (lineW) => dateStart <= lineW.dateTime && lineW.dateTime <= dateEnd
        )
        return subContent
    }
}
