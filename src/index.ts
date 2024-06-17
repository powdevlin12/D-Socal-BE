import express from 'express'
import { UPLOAD_VIDEO_FOLDER } from './constants/dir'
import { defaultErrorHandler } from './middlewares/error.middleware'
import mediasRouter from './routes/medias.router'
import staticsRouter from './routes/static.router'
import userRouter from './routes/users.router'
import { instanceDatabase } from './services/database.service'
import { initFolder } from './utils/file'
import { envConfig } from './constants/config'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

const app = express()
const port = envConfig.portServer ?? 3000
// create folder upload
initFolder()
// middlewares
app.use(express.json())
app.use(helmet())

// ** limit request
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc. See below.
})

app.use(limiter)

// routes
app.use('/users', userRouter)
app.use('/medias', mediasRouter)
app.use('/statics', staticsRouter)
app.use('/statics/video', express.static(UPLOAD_VIDEO_FOLDER))
// database
// run().catch(console.dir)
instanceDatabase()
// default handlers
app.use(defaultErrorHandler)

// Khởi động server
app.listen(port, () => {
  console.log(`Server đang lắng nghe ở cổng ${port}`)
})
