/* eslint-disable class-methods-use-this */
import { unzipAndReturnLinesFile } from '../helper/fileHelper'
import ApiLine from '../model/apiLine'
import DefaultLogger from './defaultLogger'

export default class ApiService extends DefaultLogger {
    wrapContentV0() {
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

    wrapContent(content) {
        const contentWrap = []
        content.forEach((line) => {
            contentWrap.push(new ApiLine(line))
        })
        return contentWrap
    }

    async getApiLogFromAgent(agentLogin) {
        const subContent = await this.getSubContent(agentLogin)
        return subContent
    }

    async getApiLogFromAgentAndDateTime(agentLogin, dateStart, dateEnd) {
        let subContent = await this.getApiLogFromAgent(agentLogin)
        console.info(subContent)
        subContent = subContent.filter(
            (lineW) => dateStart <= lineW.dateTime && lineW.dateTime <= dateEnd
        )
        return subContent
    }
}
