import OpenAI from 'openai'
import { config } from '../config/env'

class AIService {
  private openai: OpenAI

  constructor() {
    this.openai = new OpenAI({
      apiKey: config.openaiApiKey,
    })
  }

  async generateSummary(data: any[]): Promise<string> {
    const dataText = JSON.stringify(data, null, 2)
    
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

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a professional sales analyst providing executive-level insights.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    })

    return response.choices[0]?.message?.content || 'Unable to generate summary'
  }
}

export const aiService = new AIService()
