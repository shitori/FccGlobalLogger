import CallLogInfo from '../model/callLogInfo'

const originalCallID = process.argv[2]

async function main() {
    const call = new CallLogInfo(
        originalCallID,
        'log-apiMed.gz',
        'log-apiStat.gz',
        'log-audit.gz',
        'log-haproxyInt.gz',
        'log-haproxyOut.gz',
        'log-jgroup.gz'
    )

    await call.init()

    console.info(call.toString())
}

main()
