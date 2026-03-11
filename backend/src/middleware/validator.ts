import { Request, Response, NextFunction } from 'express'
import { body, validationResult } from 'express-validator'

export const validateUpload = [
  body('email').isEmail().withMessage('Valid email is required'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      })
    }
    next()
  },
]
