import { Request, Response, NextFunction } from 'express'
import { spreadsheetService } from '../services/spreadsheet.service'
import { aiService } from '../services/ai.service'
import { emailService } from '../services/email.service'
import { logger } from '../utils/logger'

export const uploadController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file = req.file
    const { email } = req.body

    if (!file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' })
    }

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' })
    }

    logger.info(`Processing file: ${file.originalname} for email: ${email}`)

    // Parse spreadsheet
    const data = await spreadsheetService.parse(file)
    logger.info(`Parsed ${data.length} rows from spreadsheet`)

    // Generate AI summary
    const summary = await aiService.generateSummary(data)
    logger.info('AI summary generated')

    // Send email
    await emailService.sendSummary(email, summary, file.originalname)
    logger.info(`Email sent to ${email}`)

    res.json({
      success: true,
      message: 'Sales summary sent successfully',
    })
  } catch (error) {
    next(error)
  }
}
