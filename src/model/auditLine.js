/* eslint-disable prefer-destructuring */
import LogLine from './logLine'

const regex = /(.+) \| (.+) \| (.+) \| (.+) \| (.+) \| (.+)/

export default class AuditLine extends LogLine {
    constructor(line) {
        super(line)
        const match = regex.exec(line)
        if (match) {
            this.datetime = match[1]
            this.agentLogin = match[2]
            this.sessionId = match[3]
            this.logLevel = match[4]
            this.product = match[5]
            this.message = match[6]
        } else {
            this.datetime = ''
            this.agentLogin = ''
            this.sessionId = ''
            this.logLevel = ''
            this.product = ''
            this.message = ''
        }
    }
}
