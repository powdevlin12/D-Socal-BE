import User from '~/models/schemas/User.schema'
import { instanceDatabase } from './database.service'
import { RegisterRequestBody } from '~/models/schemas/requests/User.request'
import { hashPassword } from '~/utils/cryto'
import { signToken } from '~/utils/jwt'
import { TokenType, UserVerifyStatus } from '~/constants/enums'
import refreshTokenService from './refreshToken.service'
import { ObjectId } from 'mongodb'
import { config } from 'dotenv'
import { USER_MESSAGE } from '~/constants/messages'
import { ISignToken } from '~/types/users/signToken'
config()

class UserService {
  private signAccessToken({ user_id, verify }: ISignToken) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.AccessToken,
        verify
      },
      privateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string,
      options: {
        algorithm: 'HS256',
        expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN
      }
    })
  }

  private signRefreshToken({ user_id, verify }: ISignToken) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.RefreshToken,
        verify
      },
      privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string,
      options: {
        algorithm: 'HS256',
        expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN
      }
    })
  }

  private signEmailVerifyToken({ user_id, verify }: ISignToken) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.EmailVerifyToken,
        verify
      },
      privateKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string,
      options: {
        algorithm: 'HS256',
        expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRE_IN
      }
    })
  }

  private signAccessAndRefreshToken({ user_id, verify }: ISignToken) {
    return Promise.all([this.signAccessToken({ user_id, verify }), this.signRefreshToken({ user_id, verify })])
  }

  private signForgotPasswordToken({ user_id, verify }: ISignToken) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.ForgotPasswordToken,
        verify
      },
      privateKey: process.env.JWT_SECRET_FORGOT_PASSWORD_VERIFY_TOKEN as string,
      options: {
        algorithm: 'HS256',
        expiresIn: process.env.FORGOT_PASSWORD_VERIFY_TOKEN_EXPIRE_IN
      }
    })
  }

  async register(payload: RegisterRequestBody) {
    const user_id = new ObjectId()
    const email_verify_token = await this.signEmailVerifyToken({
      user_id: user_id.toString(),
      verify: UserVerifyStatus.Unverified
    })
    const [resultUpdate, token] = await Promise.all([
      instanceDatabase().users.insertOne(
        new User({
          ...payload,
          _id: user_id,
          date_of_birth: new Date(payload.date_of_birth),
          password: hashPassword(payload.password),
          email_verify_token
        })
      ),
      this.signAccessAndRefreshToken({ user_id: user_id.toString(), verify: UserVerifyStatus.Unverified })
    ])

    await refreshTokenService.createRefeshToken({
      user_id: user_id,
      token: token[1]
    })

    return token
  }

  async checkExistEmail(email: string) {
    const result = await instanceDatabase().users.findOne({ email })
    return result
  }

  async login(user_id: string, verify: number) {
    const token = await this.signAccessAndRefreshToken({ user_id: user_id.toString(), verify })
    await refreshTokenService.createRefeshToken({
      user_id: new ObjectId(user_id),
      token: token[1]
    })
    return token
  }

  async logout(refreshToken: string) {
    const result = await instanceDatabase().refreshTokens.deleteOne({
      token: refreshToken
    })
    console.log('🚀 ~ file: user.service.ts:82 ~ UserService ~ result ~ result:', result)
    return {
      message: USER_MESSAGE.LOGOUT_SUCCESSFULLY
    }
  }

  async verifyEmail(user_id: string) {
    // const updatedAt = new Date()
    const [token, _] = await Promise.all([
      this.signAccessAndRefreshToken({ user_id: user_id.toString(), verify: UserVerifyStatus.Unverified }),
      instanceDatabase().users.updateOne(
        {
          _id: new ObjectId(user_id)
        },
        {
          $set: {
            email_verify_token: '',
            verify: UserVerifyStatus.Verified
            // updated_at: updatedAt
          },
          $currentDate: {
            updated_at: true
          }
        }
      )
    ])

    return {
      access_token: token[0],
      refresh_token: token[1]
    }
  }

  async resendEmailVerifyToken(user_id: string) {
    const new_email_verify_token = await this.signEmailVerifyToken({
      user_id: user_id.toString(),
      verify: UserVerifyStatus.Unverified
    })

    await instanceDatabase().users.updateOne(
      {
        _id: new ObjectId(user_id)
      },
      [
        {
          $set: {
            email_verify_token: new_email_verify_token,
            updated_at: '$$NOW'
          }
        }
      ]
    )

    return {
      message: USER_MESSAGE.RESEND_EMAIL_SUCCESS
    }
  }

  async forgotPasswordToken(user_id: ObjectId) {
    const forgot_password_token = await this.signForgotPasswordToken({
      user_id: user_id.toString(),
      verify: UserVerifyStatus.Verified
    })
    await instanceDatabase().users.updateOne(
      {
        _id: user_id
      },
      [
        {
          $set: {
            forgot_password_token,
            updated_at: '$$NOW'
          }
        }
      ]
    )

    return {
      message: USER_MESSAGE.CHECK_EMAIL_TO_RESET_PASSWORD
    }
  }

  async resetPassword(user_id: string, password: string) {
    await instanceDatabase().users.updateOne(
      {
        _id: new ObjectId(user_id)
      },
      {
        $set: {
          forgot_password_token: '',
          password: hashPassword(password)
        },
        $currentDate: {
          updated_at: true
        }
      }
    )

    return {
      message: USER_MESSAGE.RESET_PASSWORD_SUCCESS
    }
  }

  async getMe(user_id: string) {
    const user = await instanceDatabase().users.findOne(
      {
        _id: new ObjectId(user_id)
      },
      {
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0
        }
      }
    )

    return user
  }
}

const userService = new UserService()
export default userService
