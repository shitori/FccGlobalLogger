/* eslint-disable prefer-destructuring */
import path from 'path'
import { readFileSync } from 'fs'
import ApiService from '../service/apiService'
import AuditService from '../service/auditService'
import HaProxyIntService from '../service/haProxyIntService'
import HaProxyOutService from '../service/haProxyOutService'
import JGroupService from '../service/jGroupService'
import AuditLine from './auditLine'
import JGroupLine from './jGroupLine'
import HaProxyIntLine from './haproxyIntLine'
import HaProxyOutLine from './haproxyOutLine'
import ApiLine from './apiLine'
import DefaultObject from './defaultObject'

export default class CallLogInfo extends DefaultObject {
    constructor(
        originalCallID = '',
        jgroupLog = '',
        auditLog = '',
        haproxyIntLog = '',
        haproxyOutLog = '',
        apiMedLog = '',
        apiStatLog = ''
    ) {
        super('call', originalCallID)
        this.originalCallID = originalCallID
        this.jgroupLogFile = new JGroupService(jgroupLog)
        this.auditLogFile = new AuditService(auditLog)
        this.haproxyIntLogFile = new HaProxyIntService(haproxyIntLog)
        this.haproxyOutLogFile = new HaProxyOutService(haproxyOutLog)
        this.fullProcess = true
        this.apiMedFile = new ApiService(apiMedLog)
        this.apiStatFile = new ApiService(apiStatLog)

        this.saveInDatabase()
    }

    async init() {
        console.info('Start init')
        this.callID = await this.jgroupLogFile.findCallIdByOriginalCallID(
            this.originalCallID
        )

        console.info(`Call ID finded : ${this.callID}`)

        this.jgroupLog = await this.jgroupLogFile.getAllLogsOfCall(this.callID)

        console.info('Call Logs finded')
        console.info(this.jgroupLog)

        this.agentLogin = await this.jgroupLogFile.findAgentByOriginalCallID(
            this.originalCallID
        )

        console.info(`Agent finded : ${this.agentLogin}`)

        this.dateStart = this.jgroupLog[0].dateTime
        this.dateEnd = this.jgroupLog[this.jgroupLog.length - 1].dateTime

        console.info(`Dates finded : ${this.dateStart} -> ${this.dateEnd}`)

        this.auditLog =
            await this.auditLogFile.getAllJsErrorFromAgentAndDateTime(
                this.agentLogin,
                this.dateStart,
                this.dateEnd
            )

        console.info('JS errors finded')
        console.info(this.auditLog)

        this.haproxyIntLog = await this.haproxyIntLogFile.getAllLogFromDateTime(
            this.agentLogin,
            this.dateStart,
            this.dateEnd
        )

        console.info('LblInt Logs finded')

        this.sessionToken =
            await this.haproxyIntLogFile.getSessionTokenFromAgentAndDateTime(
                this.agentLogin,
                this.dateStart,
                this.dateEnd,
                this.haproxyIntLog
            )

        console.info(`Session Token finded : ${this.sessionToken}`)

        this.haproxyOutLog = await this.haproxyOutLogFile.getAllLogFromDateTime(
            this.sessionToken,
            this.dateStart,
            this.dateEnd
        )

        console.info('LblOut Logs finded :')
        console.info(this.haproxyOutLog)

        this.haproxyOutLogMed =
            await this.haproxyOutLogFile.getApiMedLogFromSessionTokenAndDateTime(
                this.sessionToken,
                this.dateStart,
                this.dateEnd,
                this.haproxyOutLog
            )

        console.info('API med logs finded : ')
        console.info(this.haproxyOutLogMed)

        this.haproxyOutLogStat =
            await this.haproxyOutLogFile.getApiStatLogFromSessionTokenAndDateTime(
                this.sessionToken,
                this.dateStart,
                this.dateEnd,
                this.haproxyOutLog
            )

        console.info('API Stat logs finded : ')
        console.info(this.haproxyOutLogStat)

        this.apiMedVersion = this.haproxyOutLogMed[0].requestHTTP
            .split('/')[1]
            .split('-')[2]
        this.apiMedServer = this.haproxyOutLogMed[0].requestTarget.split('/')[1]

        this.apiStatServer =
            this.haproxyOutLogStat[0].requestTarget.split('/')[1]
        this.apiStatVersion = this.haproxyOutLogStat[0].requestHTTP
            .split('/')[1]
            .split('-')[2]

        console.info(
            `HaProxy LblOut ApiMed Log from server ${this.apiMedServer} and version ${this.apiMedVersion} : `
        )

        this.apiMedLog = await this.apiMedFile.getApiLogFromAgentAndDateTime(
            this.agentLogin,
            this.dateStart,
            this.dateEnd
        )

        console.info(
            `HaProxy LblOut ApiStat Log from server ${this.apiStatServer} and version ${this.apiStatVersion} : `
        )

        this.apiStatLog = await this.apiStatFile.getApiLogFromAgentAndDateTime(
            this.agentLogin,
            this.dateStart,
            this.dateEnd
        )

        this.saveInDatabase()
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

        str += `\n ApiMed Log from server ${this.apiMedServer} and version ${this.apiMedVersion} : \n`
        this.apiMedLog.forEach((log) => {
            str += `${log.LogLine}\n`
        })

        str += `\n ApiStat Log from server ${this.apiStatServer} and version ${this.apiStatVersion} : \n`
        this.apiStatLog.forEach((log) => {
            str += `${log.LogLine}\n`
        })

        return str
    }

    searchInDatabase() {
        const pathCall = path.join(
            __dirname,
            '..',
            '..',
            'database',
            `call-${this.originalCallID}.json`
        )
        let content = ''
        try {
            content = readFileSync(pathCall)
            console.info('Call found in database')
        } catch (error) {
            console.info('Call not found in database')
            return
        }

        const jsonContent = JSON.parse(content)

        this.alreadyInit = jsonContent.alreadyInit
        this.alreadyFullInit = jsonContent.alreadyFullInit

        this.callID = jsonContent.callID
        this.agentLogin = jsonContent.agentLogin
        this.sessionToken = jsonContent.sessionToken

        this.jgroupLog = []
        jsonContent.jgroupLog.forEach((line) => {
            this.jgroupLog.push(new JGroupLine(line.LogLine))
        })

        this.auditLog = []
        jsonContent.auditLog.forEach((line) => {
            this.auditLog.push(new AuditLine(line.LogLine))
        })

        this.haproxyIntLog = []
        jsonContent.haproxyIntLog.forEach((line) => {
            this.haproxyIntLog.push(new HaProxyIntLine(line.LogLine))
        })

        this.haproxyOutLog = []
        jsonContent.haproxyOutLog.forEach((line) => {
            this.haproxyOutLog.push(new HaProxyOutLine(line.LogLine))
        })

        this.haproxyOutLogMed = []
        jsonContent.haproxyOutLogMed.forEach((line) => {
            this.haproxyOutLogMed.push(new HaProxyOutLine(line.LogLine))
        })

        this.haproxyOutLogStat = []
        jsonContent.haproxyOutLogStat.forEach((line) => {
            this.haproxyOutLogStat.push(new HaProxyOutLine(line.LogLine))
        })

        this.fullProcess = jsonContent.fullProcess

        this.apiMedServer = jsonContent.apiMedServer
        this.apiMedVersion = jsonContent.apiMedVersion

        this.apiStatServer = jsonContent.apiStatServer
        this.apiStatVersion = jsonContent.apiStatVersion

        this.apiStatLog = []
        this.apiMedLog = []

        if (this.fullProcess) {
            jsonContent.apiMedLog.forEach((line) => {
                this.apiMedLog.push(new ApiLine(line.LogLine))
            })

            jsonContent.apiStatLog.forEach((line) => {
                this.apiStatLog.push(new ApiLine(line.LogLine))
            })
        }

        console.info('Load from database success')
    }
}
