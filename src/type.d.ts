import User from './models/schemas/User.schema'
import { Request } from 'express'
import { TokenPayload } from './models/schemas/requests/User.request'
declare module 'express' {
  interface Request {
    user?: User
    decoded_authorization?: TokenPayload
    decoded_refresh_authorization?: TokenPayload
    decoded_email_verify_token?: TokenPayload
    decoded_forgot_password_token?: TokenPayload
  }
}
