import { writeFile } from '../helper/fileHelper'

export default class DefaultObject {
    constructor(name, id) {
        this.objectName = name
        this.objectId = id
    }

    async saveInDatabase() {
        await writeFile(
            `${this.objectName}-${this.objectId}.json`,
            JSON.stringify(this, null, 2)
        )
        console.info('Object saved')
    }
}
