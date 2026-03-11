import express from 'express'
import helmet from 'helmet'
import { corsMiddleware } from './config/cors'
import { rateLimiter } from './middleware/rateLimiter'
import { errorHandler } from './middleware/errorHandler'
import uploadRoutes from './routes/upload.routes'

const app = express()

// Security middleware
app.use(helmet())
app.use(corsMiddleware)

// Rate limiting
app.use(rateLimiter)

// Body parsing
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Routes
app.use('/api', uploadRoutes)

// Error handling
app.use(errorHandler)

export default app
