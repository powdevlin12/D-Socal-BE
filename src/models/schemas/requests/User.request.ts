import { JwtPayload } from 'jsonwebtoken'
import { TokenType } from '~/constants/enums'
import { ParamsDictionary } from 'express-serve-static-core'

export interface RegisterRequestBody {
  name: string
  email: string
  password: string
  confirm_password: string
  date_of_birth: string
}

export interface LogoutRequestBody {
  refreshToken: string
}

export interface LoginRequestBody {
  email: string
  password: string
}

export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
  verify: number
  exp: number
}

export interface ForgotPasswordBody {
  email: string
}

export interface VerifyForgotPasswordBody {
  forgot_password_token: string
}

export interface ResetPasswordBody {
  password: string
  confirm_password: string
  forgot_password_token: string
}

export interface UpdateMeReqBody {
  name?: string
  date_of_birth?: string
  bio?: string
  location?: string
  website?: string
  username?: string
  avatar?: string
  cover_photo?: string
}

export interface FollowReqBody {
  followed_user_id: string
}

export interface UnfollowReqParams extends ParamsDictionary {
  followed_user_id: string
}

export interface ChangePasswordReqBody {
  old_password: string
  new_password: string
  confirm_new_password: string
}

export interface RefreshTokenReqBody {
  refreshToken: string
}
