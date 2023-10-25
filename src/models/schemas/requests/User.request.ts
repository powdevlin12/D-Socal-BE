import { JwtPayload } from 'jsonwebtoken'
import { TokenType } from '~/constants/enums'

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
}

export interface ForgotPasswordBody {
  email: string
}
