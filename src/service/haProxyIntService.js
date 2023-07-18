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
}
