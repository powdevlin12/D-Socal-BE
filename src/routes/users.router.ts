import express from 'express'
import { query } from 'express-validator'
import { loginController, registerController, testValidatorController } from '~/controllers/users.controller'
import { accessTokenValidator, loginValidator, registerValidator } from '~/middlewares/users.middleware'
import { validate } from '../utils/validation'
import { wrapRequestHandler } from '../utils/handlers'
const userRouter = express.Router()

userRouter
  .post('/login', validate(loginValidator), wrapRequestHandler(loginController))
  .post('/register', validate(registerValidator), wrapRequestHandler(registerController))
  .post(
    '/logout',
    validate(accessTokenValidator),
    wrapRequestHandler((req, res, next) => {
      return res.status(200).json({
        message: 'Logouted'
      })
    })
  )
  .get(
    '/test',
    query('name').notEmpty().withMessage('Nhap name di'),
    query('age').notEmpty().withMessage('Nhap age di'),
    testValidatorController
  )
export default userRouter
