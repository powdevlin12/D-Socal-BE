import express from 'express'
import { UPLOAD_VIDEO_FOLDER } from './constants/dir'
import { defaultErrorHandler } from './middlewares/error.middleware'
import mediasRouter from './routes/medias.router'
import staticsRouter from './routes/static.router'
import userRouter from './routes/users.router'
import { instanceDatabase } from './services/database.service'
import { initFolder } from './utils/file'
import { envConfig } from './constants/config'

const app = express()
const port = envConfig.portServer ?? 3000
// create folder upload
initFolder()
// middlewares
app.use(express.json())
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
