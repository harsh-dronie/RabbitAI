require('dotenv').config()
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('./swagger')
const { rateLimiter } = require('./middleware/rateLimiter')
const uploadRoutes = require('./routes/upload')
const healthRoutes = require('./routes/health')

const app = express()
const PORT = process.env.PORT || 8000

// Security middleware
app.use(helmet())

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:3000', 'http://localhost:3002', 'https://rabbitt-ai-frontend-upgq.onrender.com']

console.log('Allowed CORS origins:', allowedOrigins) // Debug log

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      console.log('CORS blocked origin:', origin)
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))

// Rate limiting
app.use(rateLimiter)

// Body parsing
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.get('/api/health', (req, res) => {
  return res.json({ status: 'ok', service: 'Rabbitt AI backend' })
})
app.use('/health', healthRoutes)
app.use('/api', uploadRoutes)

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err.message)

  if (err.message.includes('File too large')) {
    return res.status(400).json({
      success: false,
      error: 'Invalid input'
    })
  }

  if (err.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      error: 'Invalid input'
    })
  }

  if (err.message.includes('CORS')) {
    return res.status(403).json({
      success: false,
      error: 'Invalid input'
    })
  }

  res.status(500).json({
    success: false,
    error: 'Invalid input'
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`🔗 Health check: http://localhost:${PORT}/health`)
})
