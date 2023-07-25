import AuditLine from '../model/auditLine'
import DefaultLogger from './defaultLogger'

export default class AuditService extends DefaultLogger {
    wrapContent(content) {
        const contentWrap = []
        content.forEach((line) => {
            contentWrap.push(new AuditLine(line))
        })
        return contentWrap
    }

    async getAllJsErrorFromAgent(agentLogin) {
        const subContent = await this.getSubContent(agentLogin)
        return subContent
    }

    async getAllJsErrorFromAgentAndDateTime(agentLogin, dateStart, dateEnd) {
        let subContent = await this.getSubContent(agentLogin)

        subContent = subContent.filter(
            (lineW) => dateStart <= lineW.dateTime && lineW.dateTime <= dateEnd
        )
        return subContent
    }
}
