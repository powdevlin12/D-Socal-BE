import express, { Request, Response } from 'express'
import { loginController } from '~/controllers/users.controller'
import { loginValidator } from '~/middlewares/users.middleware'
const userRouter = express.Router()

userRouter.post('/login', loginValidator, loginController)

export default userRouter
