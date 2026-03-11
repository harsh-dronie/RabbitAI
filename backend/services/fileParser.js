const XLSX = require('xlsx')
const { Readable } = require('stream')
const csvParser = require('csv-parser')

const MAX_ROWS_FOR_AI = 200

async function parseFile(file) {
  const isCSV = file.mimetype === 'text/csv'

  let data
  if (isCSV) {
    data = await parseCSV(file.buffer)
  } else {
    data = parseXLSX(file.buffer)
  }

  // Limit and condense data for AI processing
  return condenseDataForAI(data)
}

function parseCSV(buffer) {
  return new Promise((resolve, reject) => {
    const results = []
    const stream = Readable.from(buffer)

    stream
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error))
  })
}

function parseXLSX(buffer) {
  try {
    const workbook = XLSX.read(buffer, { type: 'buffer' })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    return XLSX.utils.sheet_to_json(worksheet)
  } catch (error) {
    throw new Error('Failed to parse XLSX file: ' + error.message)
  }
}

function condenseDataForAI(data) {
  if (!data || data.length === 0) {
    return { rows: [], summary: 'No data found' }
  }

  const totalRows = data.length
  const columns = Object.keys(data[0] || {})

  // If dataset is within limit, return as is
  if (totalRows <= MAX_ROWS_FOR_AI) {
    return {
      rows: data,
      totalRows,
      columns,
      condensed: false
    }
  }

  // Dataset is large - create summary
  console.log(`⚠️ Large dataset detected (${totalRows} rows). Condensing to ${MAX_ROWS_FOR_AI} rows...`)

  // Take sample: first 100, last 100
  const firstHalf = data.slice(0, 100)
  const lastHalf = data.slice(-100)
  const sampleData = [...firstHalf, ...lastHalf]

  // Calculate basic statistics for numeric columns
  const statistics = calculateStatistics(data, columns)

  return {
    rows: sampleData,
    totalRows,
    columns,
    condensed: true,
    statistics,
    note: `Dataset condensed from ${totalRows} rows to ${MAX_ROWS_FOR_AI} representative samples (first 100 + last 100 rows)`
  }
}

function calculateStatistics(data, columns) {
  const stats = {}

  columns.forEach(col => {
    const values = data.map(row => row[col]).filter(val => val !== null && val !== undefined && val !== '')
    const numericValues = values.filter(val => !isNaN(parseFloat(val))).map(val => parseFloat(val))

    if (numericValues.length > 0) {
      const sum = numericValues.reduce((a, b) => a + b, 0)
      const avg = sum / numericValues.length
      const min = Math.min(...numericValues)
      const max = Math.max(...numericValues)

      stats[col] = {
        count: numericValues.length,
        sum: sum.toFixed(2),
        average: avg.toFixed(2),
        min: min.toFixed(2),
        max: max.toFixed(2)
      }
    } else {
      // For non-numeric columns, count unique values
      const uniqueValues = [...new Set(values)]
      stats[col] = {
        count: values.length,
        uniqueCount: uniqueValues.length,
        sample: uniqueValues.slice(0, 5)
      }
    }
  })

  return stats
}

module.exports = { parseFile }
