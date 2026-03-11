import { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger'

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(`Error: ${err.message}`, { stack: err.stack })

  if (err.message.includes('File too large')) {
    return res.status(413).json({
      success: false,
      message: 'File size exceeds 5MB limit',
    })
  }

  if (err.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      message: 'Invalid file type. Only CSV and XLSX files are allowed',
    })
  }

  res.status(500).json({
    success: false,
    message: 'An error occurred while processing your request',
  })
}
