import AuditLine from '../model/auditLine'
import DefaultLogger from './defaultLogger'

export default class AuditService extends DefaultLogger {
    constructor(logName) {
        super(logName)
        this.contentWrap = this.wrapContent()
    }

    wrapContent() {
        const wraped = []
        this.content.forEach((line) => {
            wraped.push(new AuditLine(line))
        })
        return wraped
    }

    getAllJsErrorFromAgent(agentLogin) {
        const subContent = this.contentWrap.filter(
            (lineW) => lineW.agentLogin === agentLogin
        )
        return subContent
    }
}
