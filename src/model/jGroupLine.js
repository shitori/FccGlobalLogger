import LogLine from './logLine'

/* eslint-disable prefer-destructuring */
const regexWithParameter =
    /(.+) \| CosmocomEvent{uuid='(.+)', eventId=(\d*), action='(.+)', messageType='(.+)', agentLogin='(.+)', tenantId='(\d*)', site='(.+)', parameters=({.*CALL_ID=(\d+).+}), timestamp=(\d*)}/

const regexWithoutParameter =
    /(.+) \| CosmocomEvent{uuid='(.+)', eventId=(\d*), action='(.+)', messageType='(.+)', agentLogin='(.+)', tenantId='(\d*)', site='(.+)', parameters=({.*}), timestamp=(\d*)}/

export default class JGroupLine extends LogLine {
    constructor(line) {
        const matchRegexWithParameter = regexWithParameter.exec(line)
        const matchRegexWithoutParameter = regexWithoutParameter.exec(line)

        if (matchRegexWithParameter) {
            super(line, matchRegexWithParameter[1].split(',')[0])
            this.uuid = matchRegexWithParameter[2]
            this.eventId = matchRegexWithParameter[3]
            this.action = matchRegexWithParameter[4]
            this.messageType = matchRegexWithParameter[5]
            this.agentLogin = matchRegexWithParameter[6]
            this.tenantId = matchRegexWithParameter[7]
            this.site = matchRegexWithParameter[8]
            this.parameters = matchRegexWithParameter[9]
            this.callId = matchRegexWithParameter[10]
            this.timestamp = matchRegexWithParameter[11]
        } else if (matchRegexWithoutParameter) {
            super(line, matchRegexWithoutParameter[1].split(',')[0])
            this.uuid = matchRegexWithoutParameter[2]
            this.eventId = matchRegexWithoutParameter[3]
            this.action = matchRegexWithoutParameter[4]
            this.messageType = matchRegexWithoutParameter[5]
            this.agentLogin = matchRegexWithoutParameter[6]
            this.tenantId = matchRegexWithoutParameter[7]
            this.site = matchRegexWithoutParameter[8]
            this.parameters = matchRegexWithoutParameter[9]
            this.callId = ''
            this.timestamp = matchRegexWithoutParameter[10]
        } else {
            super(line, '')
            this.uuid = ''
            this.eventId = ''
            this.action = ''
            this.messageType = ''
            this.agentLogin = ''
            this.tenantId = ''
            this.site = ''
            this.parameters = ''
            this.callId = ''
            this.timestamp = ''
        }
    }
}
