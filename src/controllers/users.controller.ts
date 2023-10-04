import { Request, Response } from 'express'

export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body
  if (email === 'trandat' && password === '123') {
    return res.status(200).json({
      message: 'Login successful'
    })
  } else {
    return res.status(400).json({
      message: 'Login failed'
    })
  }
}
