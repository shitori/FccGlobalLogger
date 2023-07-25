export function defaultFunction() {
    return 'this is default helper function'
}

export function progressBar(percent) {
    let progress = ''
    for (let i = 0; i < 50; i += 1) {
        if (i < percent / 2) {
            progress += '='
        } else {
            progress += ' '
        }
    }
    console.info(`[${progress}] ${parseInt(percent, 10)}% `)
}
