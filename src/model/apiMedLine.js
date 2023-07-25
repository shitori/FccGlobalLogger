/* eslint-disable prefer-destructuring */
import LogLine from './logLine'

const regex = /\[(.+)\] (.+) \| (.+) {2}\| (.*) \| (.*) \| (.+) \| (.+)/

export default class ApiMedLine extends LogLine {
    constructor(line) {
        const matchs = regex.exec(line)
        if (matchs) {
            super(line, matchs[2].split(',')[0])
            this.thread = matchs[1]
            this.logLevel = matchs[3]
            this.agentLogin = matchs[4]
            this.sessionToken = matchs[5]
            this.javaClass = matchs[6]
            this.message = matchs[7]
        } else {
            super(line, '')
            this.thread = ''
            this.logLevel = ''
            this.agentLogin = ''
            this.sessionToken = ''
            this.javaClass = ''
            this.message = ''
        }
    }
}
