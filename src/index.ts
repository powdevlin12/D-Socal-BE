import express, { Request, Response } from 'express'
const app = express()
const port = 3000

// Định nghĩa các route và xử lý các yêu cầu
app.get('/', (req: Request, res: Response) => {
  res.send('Chào mừng đến với Express.js server!')
})

// Khởi động server
app.listen(port, () => {
  console.log(`Server đang lắng nghe ở cổng ${port}`)
})
