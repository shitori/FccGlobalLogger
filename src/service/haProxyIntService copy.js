import HaProxyIntLine from '../model/haproxyIntLine'
import DefaultLogger from './defaultLogger'

export default class HaProxyIntService extends DefaultLogger {
    constructor(logName) {
        super(logName)
        this.contentWrap = this.wrapContent()
    }

    wrapContent() {
        const wraped = []
        this.content.forEach((line) => {
            wraped.push(new HaProxyIntLine(line))
        })
        return wraped
    }

    getAllSessionTokenFromAgent(agentLogin) {
        const subContent = this.contentWrap.filter(
            (lineW) => lineW.agentLogin === agentLogin
        )
        // console.info(subContent)
        let sessionTokens = subContent.map((lineW) => lineW.sessionToken)
        sessionTokens = [...new Set(sessionTokens)]
        return sessionTokens
    }

    getSessionTokenFromAgentAndDateTime(agentLogin, dateStart, dateEnd) {
        const subContent = this.contentWrap.filter(
            (lineW) =>
                lineW.agentLogin === agentLogin &&
                dateStart <= lineW.dateTime &&
                lineW.dateTime <= dateEnd
        )
        console.info(subContent)
        console.info(agentLogin)
        console.info(dateStart)
        console.info(dateEnd)

        let sessionTokens = subContent.map((lineW) => lineW.sessionToken)
        console.info(sessionTokens)
        sessionTokens = [...new Set(sessionTokens)]

        return sessionTokens[0]
    }

    getApiMedServerFromSessionTokenAndDateTime(
        sessionToken,
        dateStart,
        dateEnd
    ) {
        console.log(this.content)
        const subContent = this.contentWrap.filter(
            (lineW) =>
                lineW.sessionToken === sessionToken /*&&
                dateStart <= lineW.dateTime &&
                lineW.dateTime <= dateEnd*/
        )
        console.info(sessionToken)
        console.info(dateStart)
        console.info(dateEnd)
        return subContent
    }
}
