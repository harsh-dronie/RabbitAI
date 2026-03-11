const express = require('express')
const multer = require('multer')
const { parseFile } = require('../services/fileParser')
const { generateSummary } = require('../services/aiService')
const { sendEmail } = require('../services/emailService')

const router = express.Router()

// Multer configuration
const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Invalid file type. Only CSV and XLSX files are allowed.'))
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
})

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Validation middleware
const validateRequest = (req, res, next) => {
  const { email } = req.body
  const file = req.file

  // Validate file exists
  if (!file) {
    return res.status(400).json({
      success: false,
      error: 'Invalid input'
    })
  }

  // Validate file size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    return res.status(400).json({
      success: false,
      error: 'Invalid input'
    })
  }

  // Validate file type
  const allowedMimes = [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
  
  if (!allowedMimes.includes(file.mimetype)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid input'
    })
  }

  // Validate email format
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid input'
    })
  }

  next()
}

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload sales spreadsheet and send AI-generated summary via email
 *     description: Accepts CSV or XLSX file, analyzes sales data with AI, and sends professional summary to specified email
 *     tags:
 *       - Upload
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - email
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Sales spreadsheet file (CSV or XLSX, max 5MB)
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Recipient email address for the summary
 *                 example: recipient@example.com
 *     responses:
 *       200:
 *         description: Sales summary sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Sales summary sent successfully
 *       400:
 *         description: Invalid input (missing file, invalid email, unsupported file type, or file too large)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Invalid input
 *       500:
 *         description: Server error during processing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Failed to send email
 */
// Upload endpoint
router.post('/upload', upload.single('file'), validateRequest, async (req, res, next) => {
  try {
    const file = req.file
    const { email } = req.body

    console.log(`📁 Processing file: ${file.originalname}`)
    console.log(`📧 Recipient: ${email}`)

    // Parse spreadsheet
    const parsedData = await parseFile(file)
    console.log(`✅ Parsed ${parsedData.totalRows} rows (${parsedData.condensed ? 'condensed' : 'full dataset'})`)

    // Generate AI summary
    const summary = await generateSummary(parsedData)
    console.log('🤖 AI summary generated')

    // Send email
    const emailResult = await sendEmail(email, summary, file.originalname)
    
    if (!emailResult.success) {
      console.error(`❌ Failed to send email: ${emailResult.error}`)
      // Return success anyway since processing completed
      return res.json({
        success: true,
        message: 'Sales summary generated successfully (email delivery failed - please check backend logs)'
      })
    }
    
    console.log(`📨 Email sent to ${email} (Message ID: ${emailResult.messageId})`)

    res.json({
      success: true,
      message: 'Sales summary sent successfully'
    })

  } catch (error) {
    console.error('Upload error:', error.message)
    next(error)
  }
})

module.exports = router
