require('dotenv').load()

const cookieParser = require('cookie-parser')
const createServer = require('./createServer')
const db = require('./db')
const jwt = require('jsonwebtoken')

const server = createServer()

server.express.use(cookieParser())
server.express.use((req, res, next) => {
  const { token } = req.cookies
  console.log(token)

  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET)
    req.userId = userId
  }

  next()
})

server.express.use(async (req, res, next) => {
  if (!req.userId) return next()

  const user = await db.query.user({ where: { id: req.userId } }, `
    {
      id,
      name,
      email,
      permissions
    }
  `)

  req.user = user
  next()
})

server.start({
  cors: {
    credentials: true,
    origin: process.env.FRONTEND_URL
  }
}, data => console.log(`Server is now running on port ${data.port}`))
