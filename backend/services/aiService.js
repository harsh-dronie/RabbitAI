const { GoogleGenerativeAI } = require('@google/generative-ai')

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

async function generateSummary(parsedData) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.warn('Gemini API key not configured, using mock summary')
      return generateMockSummary(parsedData)
    }

    const { rows, totalRows, columns, condensed, statistics, note } = parsedData
    
    let dataText = ''
    
    if (condensed) {
      dataText = `
Dataset Overview:
- Total Rows: ${totalRows}
- Columns: ${columns.join(', ')}
- Note: ${note}

Statistical Summary:
${JSON.stringify(statistics, null, 2)}

Sample Data (Representative Rows):
${JSON.stringify(rows, null, 2)}
`
    } else {
      dataText = JSON.stringify(rows, null, 2)
    }
    
    const prompt = `Analyze the following sales data and provide a professional narrative summary with key insights, trends, and recommendations.

Sales Data:
${dataText}

Please provide:
1. Executive Summary
2. Key Performance Metrics
3. Notable Trends
4. Top Performers
5. Recommendations

Keep the summary concise, professional, and actionable.`

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    
    const result = await model.generateContent([
      'You are a professional sales analyst providing executive-level insights.',
      prompt
    ])
    
    const response = await result.response
    const summary = response.text()

    return summary || 'Unable to generate summary'
  } catch (error) {
    console.error('AI Service Error:', error.message)
    console.warn('Using mock summary due to error')
    return generateMockSummary(parsedData)
  }
}

function generateMockSummary(parsedData) {
  const { totalRows, columns, condensed } = parsedData
  
  return `
SALES ANALYSIS SUMMARY
Generated: ${new Date().toLocaleDateString()}

EXECUTIVE SUMMARY
This analysis covers ${totalRows} sales records with ${columns.length} data points per record.
${condensed ? `\nNote: Large dataset was intelligently condensed for analysis while preserving key insights.` : ''}

KEY PERFORMANCE METRICS
• Total Records Analyzed: ${totalRows}
• Data Fields: ${columns.join(', ')}
• Analysis Period: Current dataset

NOTABLE TRENDS
The sales data shows consistent patterns across multiple dimensions. Key metrics indicate stable performance with opportunities for optimization in several areas.

TOP PERFORMERS
Analysis of the dataset reveals strong performance indicators across various categories. Detailed breakdowns show competitive positioning and market presence.

RECOMMENDATIONS
1. Continue monitoring key performance indicators
2. Focus on data-driven decision making
3. Implement regular review cycles
4. Optimize resource allocation based on insights
5. Maintain consistent tracking and reporting

Note: This is a demonstration summary. For AI-powered insights, please configure Gemini API key.
`
}

module.exports = { generateSummary }
