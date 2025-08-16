import { RefreshToken, RefreshTokenType } from '~/models/schemas/RefershToken.schema'
import { instanceDatabase } from './database.service'
import { verifyToken } from '~/utils/jwt'
import { TokenPayload } from '~/models/schemas/requests/User.request'
import { envConfig } from '~/constants/config'
import mysqlService from './mysql.service'

class RefreshTokenService {
  async createRefeshToken(refreshToken: RefreshTokenType) {
    const rfToken = new RefreshToken(refreshToken)
    const insertQuery = `
        INSERT INTO refresh_tokens (user_id, token, exp, iat, created_at) 
        VALUES (?, ?, ?, ?, ?)
      `

    const result = await mysqlService.query(insertQuery, [
      rfToken.user_id,
      rfToken.token,
      rfToken.exp,
      rfToken.iat,
      rfToken.createdAt
    ])
    return result
  }

  // async deleteRefreshToken(token: string) {
  //   await instanceDatabase().refreshTokens.deleteOne({
  //     token
  //   })
  // }

  public decodeRefreshToken(token: string): Promise<TokenPayload> {
    return verifyToken({ token, privateKey: envConfig.secretRefreshToken })
  }
}

const refreshTokenService = new RefreshTokenService()
export default refreshTokenService
