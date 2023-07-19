import LogLine from './logLine'

export default class HaProxyLine extends LogLine {
    constructor(
        line,
        dateTime,
        haProxyHostIp,
        haProxyProcessId,
        sourceIp,
        sourcePort,
        requestDateTimeAccepted,
        frontEnd,
        requestTarget,
        timeWaitingForFullRequestFromClient,
        timeWaitingInQueues,
        timeToEstablishConnectionToDestinationServer,
        timeForDestionationServerToSendResponse,
        totalTimeRequestActive,
        codeResponseHTTP,
        bytesRead,
        terminationState,
        activeConnections,
        frontEndConnections,
        backEndConnections,
        serverConnections,
        retries,
        serverQueueSize,
        backEndQueueSize,
        requestHTTP
    ) {
        super(line, dateTime)
        this.haProxyHostIp = haProxyHostIp
        this.haProxyProcessId = haProxyProcessId
        this.sourceIp = sourceIp
        this.sourcePort = sourcePort
        this.requestDateTimeAccepted = requestDateTimeAccepted
        this.frontEnd = frontEnd
        this.requestTarget = requestTarget
        this.timeWaitingForFullRequestFromClient =
            timeWaitingForFullRequestFromClient
        this.timeWaitingInQueues = timeWaitingInQueues
        this.timeToEstablishConnectionToDestinationServer =
            timeToEstablishConnectionToDestinationServer
        this.timeForDestionationServerToSendResponse =
            timeForDestionationServerToSendResponse
        this.totalTimeRequestActive = totalTimeRequestActive
        this.codeResponseHTTP = codeResponseHTTP
        this.bytesRead = bytesRead
        this.terminationState = terminationState
        this.activeConnections = activeConnections
        this.frontEndConnections = frontEndConnections
        this.backEndConnections = backEndConnections
        this.serverConnections = serverConnections
        this.retries = retries
        this.serverQueueSize = serverQueueSize
        this.backEndQueueSize = backEndQueueSize
        this.requestHTTP = requestHTTP
    }
}
