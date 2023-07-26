import CallLogInfo from '../model/callLogInfo'
import AuditService from '../service/auditService'
import HaProxyIntService from '../service/haProxyIntService'
import HaProxyOutService from '../service/haProxyOutService'
import JGroupService from '../service/jGroupService'

async function main() {
    const call = new CallLogInfo(
        '2e978f1d25580360',
        'jgroups.log.2023-06-26.gz',
        'audit.log.2023-06-26.gz',
        'haproxy_debug.log-20230627lblint.gz',
        'haproxy_debug.log-20230627lblout.gz',
        'api-mediation-3.29.3.log.2023-06-26.gz',
        'api-stats-3.13.0.log.2023-06-26.gz'
    )

    await call.init()

    /*await writeFile(`call-${call.originalCallID}.txt`, call.toString())
    await writeFile(
        `call-${call.originalCallID}.json`,
        JSON.stringify(call, null, 2)
    )*/
}

async function main2() {
    const logFile = new HaProxyIntService('haproxy_debug.log-20230627lblint.gz')

    console.info(logFile)

    const info = await logFile.getAllSessionTokenFromAgent('scatak.miele')
    console.info(info)
}

async function main3() {
    const logFile = new JGroupService('jgroups.log.2023-06-26.gz')

    console.info(logFile)

    const call = await logFile.findCallIdByOriginalCallID('2e978ea921500240')

    const logCall = await logFile.getAllLogsOfCall(call)

    console.info(logCall)

    const dateStart = logCall[0].dateTime
    const dateEnd = logCall[logCall.length - 1].dateTime

    console.info(dateStart)
    console.info(dateEnd)
}

async function main4() {
    const logFile = new AuditService('audit.log.2023-06-26.gz')

    const info = await logFile.getAllJsErrorFromAgent('scatak.miele')
    console.info(info)
}

async function main5() {
    const logFile = new HaProxyOutService('haproxy_debug.log-20230627lblout.gz')

    const ds = new Date('Mon Jun 26 2023 09:46:28 GMT+0100 (UTC+01:00)')
    const df = new Date('Mon Jun 26 2023 09:51:54 GMT+0100 (UTC+01:00)')

    const sessionToken = 'cf4f38382fba9ca5d4f067e3619a5175507f65a7600ceae480'

    const info = await logFile.getAllLogFromDateTime(sessionToken, ds, df)
    console.info(info)
}

async function main6() {
    const call = new CallLogInfo(
        '2e978f1d25580360',
        'jgroups.log.2023-06-26.gz',
        'audit.log.2023-06-26.gz',
        'haproxy_debug.log-20230627lblint.gz',
        'haproxy_debug.log-20230627lblout.gz',
        'api-mediation-3.29.3.log.2023-06-26.gz',
        'api-stats-3.13.0.log.2023-06-26.gz'
    )

    await call.searchInDatabase()
    /*await writeFile(`call-${call.originalCallID}.txt`, call.toString())
    await writeFile(
        `call-${call.originalCallID}.json`,
        JSON.stringify(call, null, 2)
    )*/
}

main()
