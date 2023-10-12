import express, { NextFunction, Request, Response } from 'express'
import userRouter from './routes/users.router'
import { instanceDatabase } from './services/database.service'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
const port = process.env.PORT_SERVER || 3000

// middlewares
app.use(express.json())
// routes
app.use('/users', userRouter)
// database
// run().catch(console.dir)
instanceDatabase()

// default handlers
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  return res.status(500).json({
    message: err.message
  })
})

// Khởi động server
app.listen(port, () => {
  console.log(`Server đang lắng nghe ở cổng ${port}`)
})
