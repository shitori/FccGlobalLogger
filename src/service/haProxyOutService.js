import HaProxyOutLine from '../model/haproxyOutLine'
import DefaultLogger from './defaultLogger'

export default class HaProxyOutService extends DefaultLogger {
    constructor(logName) {
        super(logName)
        this.contentWrap = this.wrapContent()
    }

    wrapContent() {
        const wraped = []
        this.content.forEach((line) => {
            wraped.push(new HaProxyOutLine(line))
        })
        return wraped
    }

    getApiMedLogFromSessionTokenAndDateTime(sessionToken, dateStart, dateEnd) {
        return this.getApiTargetLogFromSessionTokenAndDateTime(
            sessionToken,
            dateStart,
            dateEnd,
            'MED'
        )
    }

    getApiStatLogFromSessionTokenAndDateTime(sessionToken, dateStart, dateEnd) {
        return this.getApiTargetLogFromSessionTokenAndDateTime(
            sessionToken,
            dateStart,
            dateEnd,
            'STAT'
        )
    }

    getApiTargetLogFromSessionTokenAndDateTime(
        sessionToken,
        dateStart,
        dateEnd,
        target
    ) {
        const subContent = this.contentWrap.filter(
            (lineW) =>
                lineW.sessionToken === sessionToken &&
                dateStart <= lineW.dateTime &&
                lineW.dateTime <= dateEnd &&
                lineW.requestTarget.includes(target)
        )
        return subContent
    }

    getAllLogFromDateTime(sessionToken, dateStart, dateEnd) {
        const subContent = this.contentWrap.filter(
            (lineW) =>
                lineW.sessionToken === sessionToken &&
                dateStart <= lineW.dateTime &&
                lineW.dateTime <= dateEnd
        )
        return subContent
    }
}
