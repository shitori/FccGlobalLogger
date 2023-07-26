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
                this.agentLogin,
                this.dateStart,
                this.dateEnd
            )
        this.haproxyOutLogStat =
            this.haproxyOutLogFile.getApiStatLogFromSessionTokenAndDateTime(
                this.agentLogin,
                this.dateStart,
                this.dateEnd
            )

        //TODO apimed et apistat
    }
}
