export default class LogLine {
    constructor(line, dateTime) {
        this.LogLine = line
        if (dateTime !== '') {
            this.dateTime = new Date(dateTime)
            this.dateTime.setYear(2023)
        }
    }
}
