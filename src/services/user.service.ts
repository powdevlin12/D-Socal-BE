import User from '~/models/schemas/User.schema'
import { instanceDatabase } from './database.service'
import { RegisterRequestBody } from '~/models/schemas/requests/User.request'
import { hashPassword } from '~/utils/cryto'
import { signToken } from '~/utils/jwt'
import { TokenType } from '~/constants/enums'
import refreshTokenService from './refreshToken.service'
import { ObjectId } from 'mongodb'
import { config } from 'dotenv'
config()

class UserService {
  private signAccessToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.AccessToken
      },
      options: {
        algorithm: 'HS256',
        expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN
      }
    })
  }

  private signRefreshToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.RefreshToken
      },
      options: {
        algorithm: 'HS256',
        expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN
      }
    })
  }

  private signAccessAndRefreshToken(user_id: string) {
    return Promise.all([this.signAccessToken(user_id), this.signRefreshToken(user_id)])
  }

  async register(payload: RegisterRequestBody) {
    const result = await instanceDatabase().users.insertOne(
      new User({
        ...payload,
        date_of_birth: new Date(payload.date_of_birth),
        password: hashPassword(payload.password)
      })
    )

    const user_id = result.insertedId.toString()

    const token = await this.signAccessAndRefreshToken(user_id)

    await refreshTokenService.createRefeshToken({
      user_id: new ObjectId(user_id),
      token: token[1]
    })

    return token
  }

  async checkExistEmail(email: string) {
    const result = await instanceDatabase().users.findOne({ email })
    return result
  }

  async login(user_id: string) {
    const token = await this.signAccessAndRefreshToken(user_id)
    await refreshTokenService.createRefeshToken({
      user_id: new ObjectId(user_id),
      token: token[1]
    })
    return token
  }
}

const userService = new UserService()
export default userService
