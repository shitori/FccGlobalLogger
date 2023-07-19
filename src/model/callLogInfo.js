import AuditService from '../service/auditService'
import HaProxyIntService from '../service/haProxyIntService'
import HaProxyOutService from '../service/haProxyOutService'
import JGroupService from '../service/jGroupService'

export default class CallLogInfo {
    constructor(
        originalCallID,
        jgroupLog,
        auditLog,
        haproxyIntLog,
        haproxyOutLog,
        apiMedLog, // TODO
        apiStatLog // TODO
    ) {
        this.originalCallID = originalCallID
        this.jgroupLogFile = new JGroupService(jgroupLog)
        this.callID =
            this.jgroupLogFile.findCallIdByOriginalCallID(originalCallID)
        this.jgroupLog = this.jgroupLogFile.getAllLogsOfCall(this.callID)
        this.agentLogin =
            this.jgroupLogFile.findAgentByOriginalCallID(originalCallID)
        this.auditLogFile = new AuditService(auditLog)
        this.auditLog = this.auditLogFile.getAllJsErrorFromAgent(
            this.agentLogin
        )
        this.dateStart = this.jgroupLog[0].dateTime
        this.dateEnd = this.jgroupLog[this.jgroupLog.length - 1].dateTime
        this.haproxyIntLogFile = new HaProxyIntService(haproxyIntLog)
        this.haproxyIntLog = this.haproxyIntLogFile.getAllLogFromDateTime(
            this.agentLogin,
            this.dateStart,
            this.dateEnd
        )
        this.sessionToken =
            this.haproxyIntLogFile.getSessionTokenFromAgentAndDateTime(
                this.agentLogin,
                this.dateStart,
                this.dateEnd
            )
        this.haproxyOutLogFile = new HaProxyOutService(haproxyOutLog)
        this.haproxyOutLogMed =
            this.haproxyOutLogFile.getApiMedLogFromSessionTokenAndDateTime(
                this.sessionToken,
                this.dateStart,
                this.dateEnd
            )
        this.haproxyOutLogStat =
            this.haproxyOutLogFile.getApiStatLogFromSessionTokenAndDateTime(
                this.sessionToken,
                this.dateStart,
                this.dateEnd
            )

        this.haproxyOutLog = this.haproxyOutLogFile.getAllLogFromDateTime(
            this.sessionToken,
            this.dateStart,
            this.dateEnd
        )

        // TODO apimed et apistat
    }

    toString() {
        let str = `JGroup Log for Call ID ${this.callID} from Original Call ID ${this.originalCallID}: \n`
        this.jgroupLog.forEach((log) => {
            str += `${log.LogLine}\n`
        })
        str += `\n Audit for Agent ${this.agentLogin} : \n`
        this.auditLog.forEach((log) => {
            str += `${log.LogLine}\n`
        })
        str += `\n HaProxy LblInt Log for agent ${this.agentLogin} : \n`
        this.haproxyIntLog.forEach((log) => {
            str += `${log.LogLine}\n`
        })
        str += `\n HaProxy LblOut ApiMed Log for session ${this.sessionToken} : \n`
        this.haproxyOutLogMed.forEach((log) => {
            str += `${log.LogLine}\n`
        })
        str += `\n HaProxy LblOut ApiStat Log for session ${this.sessionToken} : \n`
        this.haproxyOutLogStat.forEach((log) => {
            str += `${log.LogLine}\n`
        })
        return str
    }
}
