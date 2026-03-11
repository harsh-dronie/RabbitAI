import * as XLSX from 'xlsx'
import { Readable } from 'stream'
import csvParser from 'csv-parser'

class SpreadsheetService {
  async parse(file: Express.Multer.File): Promise<any[]> {
    const isCSV = file.mimetype === 'text/csv'

    if (isCSV) {
      return this.parseCSV(file.buffer)
    } else {
      return this.parseXLSX(file.buffer)
    }
  }

  private async parseCSV(buffer: Buffer): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const results: any[] = []
      const stream = Readable.from(buffer)

      stream
        .pipe(csvParser())
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', (error) => reject(error))
    })
  }

  private parseXLSX(buffer: Buffer): any[] {
    const workbook = XLSX.read(buffer, { type: 'buffer' })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    return XLSX.utils.sheet_to_json(worksheet)
  }
}

export const spreadsheetService = new SpreadsheetService()
