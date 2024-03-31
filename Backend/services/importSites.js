const Sites = require('../models/site')
const parquet = require('parquetjs-lite')
const { unlink } = require('node:fs/promises')

const importSitesService = async (ctx) => {
    let importedEntries = []
    let unsuccessfulImports = []

    try {
        // create new ParquetReader that reads from the context's filepath
        const parquetFilePath = ctx.path
        let reader = await parquet.ParquetReader.openFile(parquetFilePath)

        // create a new cursor
        let cursor = reader.getCursor()

        // read all records from the file and print them
        let record = null;
        while (record = await cursor.next()) {
            // { domain: 'example.com' }
            let url = record.domain

            try {
                let newSite = await Sites.create({ url })
                importedEntries.push(newSite)
            } catch {
                unsuccessfulImports.push(url)
            }
        }

        await reader.close()

        // delete the local file
        await unlink(parquetFilePath)
    } catch (error) {
        console.error('An error occurred:', error)
    }

    return new Promise((resolve, reject) => {
        if (unsuccessfulImports.length > 0) {
            reject({ unsuccessfulImports: unsuccessfulImports })
        }
        
        resolve(importedEntries)
    })
}

module.exports = importSitesService