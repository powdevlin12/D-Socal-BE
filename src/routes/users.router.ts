import express from 'express'
import {
  followUserController,
  forgotPasswordTokenController,
  getMeController,
  loginController,
  logoutController,
  registerController,
  resendEmailVerifyToken,
  resetPasswordController,
  unfollowUserController,
  updateMeController,
  verifyEmailController,
  verifyForgotPasswordTokenController
} from '~/controllers/users.controller'
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  followValidator,
  forgotPasswordValidate,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  verifiedUserMiddleware,
  updateMeValidator,
  verifyForgotPasswordValidate,
  unfollowValidator
} from '~/middlewares/users.middleware'
import { validate } from '../utils/validation'
import { wrapRequestHandler } from '../utils/handlers'
import { filterBody } from '~/middlewares/common.middleware'
import { UpdateMeReqBody } from '~/models/schemas/requests/User.request'
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
  .post('/verify-email', validate(emailVerifyTokenValidator), wrapRequestHandler(verifyEmailController))
  .post('/resend-verify-email', validate(accessTokenValidator), wrapRequestHandler(resendEmailVerifyToken))
  .post('/forgot-password-token', validate(forgotPasswordValidate), wrapRequestHandler(forgotPasswordTokenController))
  .post(
    '/verify-forgot-password-token',
    validate(verifyForgotPasswordValidate),
    wrapRequestHandler(verifyForgotPasswordTokenController)
  )
  .post('/reset-password', validate(resetPasswordValidator), wrapRequestHandler(resetPasswordController))
  .get('/get-me', validate(accessTokenValidator), wrapRequestHandler(getMeController))
  .patch(
    '/me',
    validate(accessTokenValidator),
    verifiedUserMiddleware,
    validate(updateMeValidator),
    filterBody<UpdateMeReqBody>([
      'avatar',
      'username',
      'bio',
      'cover_photo',
      'date_of_birth',
      'location',
      'name',
      'website'
    ]),
    wrapRequestHandler(updateMeController)
  )
  .post(
    '/follow',
    validate(accessTokenValidator),
    verifiedUserMiddleware,
    validate(followValidator),
    wrapRequestHandler(followUserController)
  )
  .delete(
    '/unfollow/:followed_user_id',
    validate(accessTokenValidator),
    verifiedUserMiddleware,
    validate(unfollowValidator),
    wrapRequestHandler(unfollowUserController)
  )
export default userRouter
