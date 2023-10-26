import { NextFunction, Request, Response } from 'express'
import User from '~/models/schemas/User.schema'
import userService from '~/services/user.service'
import { ParamsDictionary } from 'express-serve-static-core'
import {
  ForgotPasswordBody,
  LoginRequestBody,
  LogoutRequestBody,
  RegisterRequestBody,
  ResetPasswordBody,
  TokenPayload,
  VerifyForgotPasswordBody
} from '~/models/schemas/requests/User.request'
import { USER_MESSAGE } from '~/constants/messages'
import HTTP_STATUS from '~/constants/httpStatus'
import { instanceDatabase } from '~/services/database.service'
import { ErrorWithStatus } from '~/models/Errors'
import { ObjectId } from 'mongodb'
import { UserVerifyStatus } from '~/constants/enums'

export const loginController = async (req: Request<ParamsDictionary, any, LoginRequestBody>, res: Response) => {
  const user = req.user as User
  const token = await userService.login(user._id.toString())
  return res.status(200).json({
    message: USER_MESSAGE.LOGIN_SUCCESS,
    token
  })
}

export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await userService.register(req.body)
  if (result) {
    return res.status(200).json({
      message: USER_MESSAGE.REGISTERE_SUCCESS,
      result
    })
  }
}

export const verifyEmailController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_email_verify_token as TokenPayload

  const user = await instanceDatabase().users.findOne({
    _id: new ObjectId(user_id)
  })

  // user not found
  if (!user) {
    throw new ErrorWithStatus({
      message: USER_MESSAGE.USER_NOT_FOUND,
      status: HTTP_STATUS.NOT_FOUND
    })
  }

  // token verified
  if (user.email_verify_token === '') {
    return res.status(200).json({
      message: USER_MESSAGE.EMAIL_VERIFIED_BEFORE
    })
  }

  const result = await userService.verifyEmail(user_id)

  return res.status(HTTP_STATUS.OK).json({
    result,
    message: USER_MESSAGE.VERIFY_ACCOUNT_SUCCESS
  })
}

export const logoutController = async (
  req: Request<ParamsDictionary, any, LogoutRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { refreshToken } = req.body
  const result = await userService.logout(refreshToken)
  return res.status(HTTP_STATUS.OK).json(result)
}

export const resendEmailVerifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload

  const user = await instanceDatabase().users.findOne({
    _id: new ObjectId(user_id)
  })

  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USER_MESSAGE.USER_NOT_FOUND
    })
  }

  if (user.verify === UserVerifyStatus.Verified) {
    return res.json({
      message: USER_MESSAGE.EMAIL_VERIFIED_BEFORE
    })
  }

  const result = await userService.resendEmailVerifyToken(user_id)
  return res.status(HTTP_STATUS.CREATED).json(result)
}

export const forgotPasswordTokenController = async (
  req: Request<ParamsDictionary, any, ForgotPasswordBody>,
  res: Response,
  next: NextFunction
) => {
  const { _id } = req.user as User
  const result = await userService.forgotPasswordToken(_id)
  return res.json(result)
}

export const verifyForgotPasswordTokenController = async (
  req: Request<ParamsDictionary, any, VerifyForgotPasswordBody>,
  res: Response,
  next: NextFunction
) => {
  return res.json({
    message: USER_MESSAGE.VERIFY_FORGOT_PASSWORD_SUCCESS
  })
}

export const resetPasswordController = async (
  req: Request<ParamsDictionary, any, ResetPasswordBody>,
  res: Response,
  next: NextFunction
) => {
  const { password } = req.body
  const { user_id } = req.decoded_forgot_password_token as TokenPayload

  const result = await userService.resetPassword(user_id, password)
  return res.json(result)
}
