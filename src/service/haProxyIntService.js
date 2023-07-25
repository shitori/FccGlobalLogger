/* eslint-disable class-methods-use-this */
import HaProxyIntLine from '../model/haproxyIntLine'
import DefaultLogger from './defaultLogger'

export default class HaProxyIntService extends DefaultLogger {
    wrapContent(content) {
        const contentWrap = []
        content.forEach((line) => {
            contentWrap.push(new HaProxyIntLine(line))
        })
        return contentWrap
    }

    async getAllSessionTokenFromAgent(agentLogin) {
        const subContent = await this.getSubContent(agentLogin)
        let sessionTokens = subContent.map((lineW) => lineW.sessionToken)

        sessionTokens = [...new Set(sessionTokens)]
        return sessionTokens
    }

    async getSessionTokenFromAgentAndDateTime(
        agentLogin,
        dateStart,
        dateEnd,
        content = undefined
    ) {
        let subContent = []
        if (content === undefined) {
            subContent = await this.getAllLogFromDateTime(
                agentLogin,
                dateStart,
                dateEnd
            )
        } else {
            subContent = content
        }

        let sessionTokens = subContent.map((lineW) => lineW.sessionToken)
        sessionTokens = [...new Set(sessionTokens)]
        console.info(sessionTokens[0])
        return sessionTokens[0]
    }

    async getAllLogFromDateTime(agentLogin, dateStart, dateEnd) {
        let subContent = await this.getSubContent(agentLogin)
        subContent = subContent.filter(
            (lineW) => dateStart <= lineW.dateTime && lineW.dateTime <= dateEnd
        )
        return subContent
    }
}
