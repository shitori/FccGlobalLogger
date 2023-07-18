import HaProxyIntLine from '../model/haproxyIntLine'
import HaProxyOutLine from '../model/haproxyOutLine'
import AuditService from '../service/auditService'
import HaProxyIntService from '../service/haProxyIntService'
import JGroupService from '../service/jGroupService'

const jGroupService = new JGroupService('jgroups.log.2023-06-30.gz')

const auditService = new AuditService('audit.log.2023-06-30.gz')

const haproxy = new HaProxyIntService('haproxy_debug.log-20230630lblint.gz')

/* const id = jGroupService.findCallIdByOriginalCallID('2E9E731D00080027')
const agent = jGroupService.findAgentByOriginalCallID('2E9E731D00080027')
console.info(id)
console.info(agent) */

// console.info(auditService.getAllJsErrorFromAgent(agent))
// console.info(jGroupService.getAllLogsOfCall(id))

const strInt =
    'Jun 26 10:37:09 localhost haproxy[3050934]: 172.22.10.172:51682 [26/Jun/2023:10:36:54.742] frontend-http-in-80 back_aps_default/OPCM35ANAPS201 0/0/13/14769/14782 200 873 - - --VN 3220/2741/2690/143/0 0/0 {scatak.miele|0194740c0f08a6d78e77d073da1fdc565f25cbb5e01e637c13} "POST /AgentWS/EventsService.asmx HTTP/1.1"'
console.info(new HaProxyIntLine(strInt))

const strOut =
    'Jun 26 10:32:58 localhost haproxy[3102996]: 165.225.21.41:8818 [26/Jun/2023:10:32:58.020] https-in~ back_apimediation/OPNXTVDR1APIMED07 0/0/0/173/173 200 15819 sessiontoken=0194740c0f08a6d78e77d073da1fdc565f25cbb5e01e637c13 - --VN 5092/5092/0/0/0 0/0 {https://web-windesktop.flexiblecontactcenter.orange-business.com|176.182.207.39} "POST /api-mediation-3.29.3/api/bootstrapServices/startService HTTP/1.1"'
console.info(new HaProxyOutLine(strOut))

haproxy.contentWrap.forEach((c) => {
    if (c.dateTime !== '') {
        console.info(c)
    }
})
