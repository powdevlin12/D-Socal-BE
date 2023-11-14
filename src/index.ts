import express from 'express'
import userRouter from './routes/users.router'
import { instanceDatabase } from './services/database.service'
import dotenv from 'dotenv'
import { defaultErrorHandler } from './middlewares/error.middleware'
import mediasRouter from './routes/medias.router'
import { initFolder } from './utils/file'
dotenv.config()

const app = express()
const port = process.env.PORT_SERVER || 3000
// Tạo folder upload
initFolder()

// middlewares
app.use(express.json())
// routes
app.use('/users', userRouter)
app.use('/medias', mediasRouter)
// database
// run().catch(console.dir)
instanceDatabase()

// default handlers
app.use(defaultErrorHandler)

// Khởi động server
app.listen(port, () => {
  console.log(`Server đang lắng nghe ở cổng ${port}`)
})
