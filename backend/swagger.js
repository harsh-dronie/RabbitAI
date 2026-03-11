const swaggerJSDoc = require('swagger-jsdoc')

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Rabbitt AI — Sales Insight Automator API",
      version: "1.0.0",
      description: "API docs for Rabbitt AI backend"
    },
    servers: [
      {
        url: "http://localhost:8000",
        description: "Local"
      },
      {
        url: "https://your-app.onrender.com",
        description: "Production"
      }
    ]
  },
  apis: ["./routes/*.js"]
}

const swaggerSpec = swaggerJSDoc(options)

module.exports = swaggerSpec
