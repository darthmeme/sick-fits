require('dotenv').load()

const createServer = require('./createServer')
const db = require('./db')

const server = createServer()

server.start({
  cors: {
    credentials: true,
    origin: process.env.FRONTEND_URL
  }
}, () => console.log('Server is now running.'))
