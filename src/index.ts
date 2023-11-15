import express from 'express'
import userRouter from './routes/users.router'
import { instanceDatabase } from './services/database.service'
import dotenv from 'dotenv'
import { defaultErrorHandler } from './middlewares/error.middleware'
import mediasRouter from './routes/medias.router'
import { initFolder } from './utils/file'
import { UPLOAD_IMG_FOLDER, UPLOAD_VIDEO_FOLDER } from './constants/dir'
import staticsRouter from './routes/static.router'
dotenv.config()

const app = express()
const port = process.env.PORT_SERVER ?? 3000
// create folder upload
initFolder()
// middlewares
app.use(express.json())
// routes
app.use('/users', userRouter)
app.use('/medias', mediasRouter)
app.use('/statics', staticsRouter)
// database
// run().catch(console.dir)
instanceDatabase()
// default handlers
app.use(defaultErrorHandler)

// Khởi động server
app.listen(port, () => {
  console.log(`Server đang lắng nghe ở cổng ${port}`)
})
