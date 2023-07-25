/* eslint-disable class-methods-use-this */
import HaProxyOutLine from '../model/haproxyOutLine'
import DefaultLogger from './defaultLogger'

export default class HaProxyOutService extends DefaultLogger {
    wrapContent(content) {
        const contentWrap = []
        content.forEach((line) => {
            contentWrap.push(new HaProxyOutLine(line))
        })
        return contentWrap
    }

    getApiMedLogFromSessionTokenAndDateTime(
        sessionToken,
        dateStart,
        dateEnd,
        content = undefined
    ) {
        const subContent = this.getApiTargetLogFromSessionTokenAndDateTime(
            sessionToken,
            dateStart,
            dateEnd,
            'MED',
            content
        )
        return subContent
    }

    async getApiStatLogFromSessionTokenAndDateTime(
        sessionToken,
        dateStart,
        dateEnd,
        content = undefined
    ) {
        const subContent =
            await this.getApiTargetLogFromSessionTokenAndDateTime(
                sessionToken,
                dateStart,
                dateEnd,
                'STAT',
                content
            )
        return subContent
    }

    async getApiTargetLogFromSessionTokenAndDateTime(
        sessionToken,
        dateStart,
        dateEnd,
        target,
        content = undefined
    ) {
        let subContent = []
        if (content === undefined) {
            subContent = await this.getAllLogFromDateTime(
                sessionToken,
                dateStart,
                dateEnd
            )
        } else {
            subContent = content
        }

        subContent = subContent.filter((lineW) =>
            lineW.requestTarget.includes(target)
        )
        return subContent
    }

    async getAllLogFromDateTime(sessionToken, dateStart, dateEnd) {
        let subContent = await this.getSubContent(sessionToken)

        subContent = subContent.filter(
            (lineW) => dateStart <= lineW.dateTime && lineW.dateTime <= dateEnd
        )
        return subContent
    }
}
