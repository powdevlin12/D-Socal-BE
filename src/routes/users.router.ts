import express from 'express'
import { query } from 'express-validator'
import {
  loginController,
  logoutController,
  registerController,
  testValidatorController
} from '~/controllers/users.controller'
import {
  accessTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from '~/middlewares/users.middleware'
import { validate } from '../utils/validation'
import { wrapRequestHandler } from '../utils/handlers'
const userRouter = express.Router()

userRouter
  .post('/login', validate(loginValidator), wrapRequestHandler(loginController))
  .post('/register', validate(registerValidator), wrapRequestHandler(registerController))
  .post(
    '/logout',
    validate(accessTokenValidator),
    validate(refreshTokenValidator),
    wrapRequestHandler(logoutController)
  )
  .get(
    '/test',
    query('name').notEmpty().withMessage('Nhap name di'),
    query('age').notEmpty().withMessage('Nhap age di'),
    testValidatorController
  )
export default userRouter
