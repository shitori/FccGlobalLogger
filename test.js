const { exec } = require('child_process')

exec(
    'zgrep cf4f38382fba9ca5d4f067e3619a5175507f65a7600ceae480 ./upload/haproxy_debug.log-20230627lblout.gz',
    (error, stdout, stderr) => {
        if (error) {
            throw error
        }
        console.info(stdout)
    }
)
