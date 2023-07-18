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
}
