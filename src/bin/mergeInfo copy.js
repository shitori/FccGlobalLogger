import HaProxyIntLine from '../model/haproxyIntLine'
import HaProxyOutLine from '../model/haproxyOutLine'
import AuditService from '../service/auditService'
import HaProxyIntService from '../service/haProxyIntService'
import HaProxyOutService from '../service/haProxyOutService'
import JGroupService from '../service/jGroupService'

const jGroupService = new JGroupService('jgroups.log.2023-06-30.gz')

const auditService = new AuditService('audit.log.2023-06-30.gz')

const haproxyInt = new HaProxyIntService('haproxy_debug.log-20230701lblint.gz')
const haproxyOut = new HaProxyOutService('haproxy_debug.log-20230701lblout.gz')

const id = jGroupService.findCallIdByOriginalCallID('2E1B3BE8B4140010')
const agent = jGroupService.findAgentByOriginalCallID('2E1B3BE8B4140010')
console.info(id)
console.info(agent)

const logErrorJS = auditService.getAllJsErrorFromAgent(agent)
const logCall = jGroupService.getAllLogsOfCall(id)
console.info(logCall)
const sessionTokens = haproxyInt.getAllSessionTokenFromAgent(agent)
console.info(sessionTokens)

const sessionToken = haproxyInt.getSessionTokenFromAgentAndDateTime(
    agent,
    logCall[0].dateTime,
    logCall[logCall.length - 1].dateTime
)
console.info(sessionToken)

const logInfoApiMed = haproxyOut.getApiMedLogFromSessionTokenAndDateTime(
    sessionToken,
    logCall[0].dateTime,
    logCall[logCall.length - 1].dateTime
)

console.info(logInfoApiMed)

const logInfoApiStat = haproxyOut.getApiStatLogFromSessionTokenAndDateTime(
    sessionToken,
    logCall[0].dateTime,
    logCall[logCall.length - 1].dateTime
)

console.info(logInfoApiMed)
