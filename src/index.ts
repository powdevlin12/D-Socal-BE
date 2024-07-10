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
import cors from 'cors'

import YAML from 'yaml'
import fs from 'fs'
import path from 'path'
import swaggerUI from 'swagger-ui-express'
import tweetRouter from './routes/tweets.router'
import { hashTagsRoute } from './routes/hashtags.router'

const file = fs.readFileSync(path.resolve('doc-api.yaml'), 'utf-8')
const swaggerDocument = YAML.parse(file)

const app = express()
const port = envConfig.portServer ?? 3000
// create folder upload
initFolder()
// middlewares
app.use(express.json())
app.use(helmet())
app.use(cors())
app.use('/doc-api', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

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
app.use('/tweets', tweetRouter)
app.use('/hash-tags', hashTagsRoute)
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
