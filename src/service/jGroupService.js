import JGroupLine from '../model/jGroupLine'
import DefaultLogger from './defaultLogger'

export default class JGroupService extends DefaultLogger {
    wrapContent(content) {
        const contentWrap = []
        content.forEach((line) => {
            contentWrap.push(new JGroupLine(line))
        })
        return contentWrap
    }

    async findCallIdByOriginalCallID(callIdOrigine) {
        let callId = ''
        const subContent = await this.getSubContent(callIdOrigine)
        subContent.forEach((lineW) => {
            callId = lineW.callId
        })
        console.info(callId)
        return callId
    }

    async findAgentByOriginalCallID(callIdOrigine) {
        let agentLogin = ''
        const subContent = await this.getSubContent(callIdOrigine)
        subContent.forEach((lineW) => {
            agentLogin = lineW.agentLogin
        })
        console.info(agentLogin)
        return agentLogin
    }

    async getAllLogsOfCall(callID) {
        const subContent = await this.getSubContent(callID)
        return subContent
    }

    async getAllLogsOfAgent(agentLogin) {
        const subContent = await this.getSubContent(agentLogin)
        return subContent
    }
}
