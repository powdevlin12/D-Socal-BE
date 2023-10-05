import express, { Request, Response } from 'express'
import { loginController, registerController } from '~/controllers/users.controller'
import { loginValidator } from '~/middlewares/users.middleware'
const userRouter = express.Router()

userRouter.post('/login', loginValidator, loginController)
userRouter.post('/register', registerController)
export default userRouter
