import express, { Request, Response } from 'express'
import userRouter from './routes/users.router'
import { run } from './services/database.service'

const app = express()
const port = 3000

// middlewares
app.use(express.json())
// routes
app.use('/users', userRouter)
// database
run().catch(console.dir)
// Định nghĩa các route và xử lý các yêu cầu
app.get('/', (req: Request, res: Response) => {
  res.send('Chào mừng đến với Express.js server!')
})

// Khởi động server
app.listen(port, () => {
  console.log(`Server đang lắng nghe ở cổng ${port}`)
})
