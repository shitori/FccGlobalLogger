import ApiMedLine from '../model/apiMedLine'
import DefaultLogger from './defaultLogger'

export default class ApiMedService extends DefaultLogger {
    constructor(logName) {
        super(logName)
        this.contentWrap = this.wrapContent()
    }

    wrapContent() {
        const wraped = []
        this.content.forEach((line) => {
            wraped.push(new ApiMedLine(line))
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

    getApiMedLogFromAgent(agentLogin) {
        const subContent = this.contentWrap.filter(
            (lineW) =>
                lineW.message.includes(agentLogin) ||
                lineW.agentLogin.includes(agentLogin)
        )
        return subContent
    }

    getApiMedLogFromAgentAndDateTime(agentLogin, dateStart, dateEnd) {
        let subContent = this.getApiMedLogFromAgent(agentLogin)
        console.info(subContent)
        subContent = subContent.filter(
            (lineW) => dateStart <= lineW.dateTime && lineW.dateTime <= dateEnd
        )
        return subContent
    }
}
