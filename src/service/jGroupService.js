import JGroupLine from '../model/jGroupLine'
import DefaultLogger from './defaultLogger'

export default class JGroupService extends DefaultLogger {
    constructor(logName) {
        super(logName)
        this.contentWrap = this.wrapContent()
    }

    wrapContent() {
        const wraped = []
        this.content.forEach((line) => {
            wraped.push(new JGroupLine(line))
        })
        return wraped
    }

    findLinesByOriginalCallID(callIdOrigine) {
        const subContent = this.contentWrap.filter((lineW) =>
            lineW.parameters.includes(callIdOrigine)
        )
        return subContent
    }

    findCallIdByOriginalCallID(callIdOrigine) {
        let callId
        const subContent = this.contentWrap.filter((lineW) =>
            lineW.parameters.includes(callIdOrigine)
        )
        subContent.forEach((lineW) => {
            callId = lineW.callId
        })
        console.info(callId)
        return callId
    }

    findAgentByOriginalCallID(callIdOrigine) {
        let agentLogin
        const subContent = this.contentWrap.filter((lineW) =>
            lineW.parameters.includes(callIdOrigine)
        )
        subContent.forEach((lineW) => {
            agentLogin = lineW.agentLogin
        })
        return agentLogin
    }

    getAllLogsOfCall(callID) {
        const subContent = this.contentWrap.filter((lineW) =>
            lineW.parameters.includes(callID)
        )
        return subContent
    }

    getAllLogsOfAgent(agentLogin) {
        const subContent = this.contentWrap.filter(
            (lineW) => lineW.agentLogin === agentLogin
        )
        return subContent
    }

    getPreviousCall(agentLogin, callID) {
        let previousCallID = callID
        const subContent = this.contentWrap.filter(
            (lineW) =>
                lineW.agentLogin === agentLogin && lineW.action === 'NEW_CALL'
        )

        let index = subContent.findIndex((lineW) => lineW.callID === callID)
        while (index >= 0 && previousCallID === callID) {
            console.info(index)
            index -= 1
            previousCallID = subContent[index]
        }
        return this.getAllLogsOfCall(previousCallID)
    }
}
