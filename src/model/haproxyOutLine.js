/* eslint-disable prefer-destructuring */
import HaProxyLine from './haproxyLine'

const regex =
    /(.+) (.+) (.+): (.+):(.+) \[(.+)\] (.+) (.+) (\d+)\/(\d+)\/(\d+)\/(\d+)\/(\d+) (\d+) (\d+) sessiontoken=(.+) - --(.+) (\d+)\/(\d+)\/(\d+)\/(\d+)\/(\d+) (\d+)\/(\d+) {(.+)\|(.*)} "(.+)"/

export default class HaProxyOutLine extends HaProxyLine {
    constructor(line) {
        const matchs = regex.exec(line)
        if (matchs) {
            super(
                line,
                matchs[1],
                matchs[2],
                matchs[3],
                matchs[4],
                matchs[5],
                matchs[6],
                matchs[7],
                matchs[8],
                matchs[9],
                matchs[10],
                matchs[11],
                matchs[12],
                matchs[13],
                matchs[14],
                matchs[15],
                matchs[17],
                matchs[18],
                matchs[19],
                matchs[20],
                matchs[21],
                matchs[22],
                matchs[23],
                matchs[24],
                matchs[27]
            )
            this.sessionToken = matchs[16]
            this.serverDNS = matchs[25]
            this.serverIP = matchs[26]
        } else {
            super(
                line,
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                ''
            )
            this.agentLogin = ''
            this.sessionToken = ''
        }
    }
}
