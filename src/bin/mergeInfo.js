import writeFile from '../helper/fileHelper'
import CallLogInfo from '../model/callLogInfo'

async function main() {
    const call = new CallLogInfo(
        '2E1B3BE8B4140010',
        'jgroups.log.2023-06-30.gz',
        'audit.log.2023-06-30.gz',
        'haproxy_debug.log-20230701lblint.gz',
        'haproxy_debug.log-20230701lblout.gz',
        '',
        ''
    )
    await writeFile('tmp.txt', call.toString())
}

main()
