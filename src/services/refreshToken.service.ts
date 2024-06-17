import { RefreshToken, RefreshTokenType } from '~/models/schemas/RefershToken.schema'
import { instanceDatabase } from './database.service'
import { verifyToken } from '~/utils/jwt'
import { TokenPayload } from '~/models/schemas/requests/User.request'
import { envConfig } from '~/constants/config'

class RefreshTokenService {
  async createRefeshToken(refreshToken: RefreshTokenType) {
    const result = await instanceDatabase().refreshTokens.insertOne(new RefreshToken(refreshToken))
    return result
  }

  async deleteRefreshToken(token: string) {
    await instanceDatabase().refreshTokens.deleteOne({
      token
    })
  }

  public decodeRefreshToken(token: string): Promise<TokenPayload> {
    return verifyToken({
      token,
      privateKey: envConfig.secretRefreshToken
    })
  }
}

const refreshTokenService = new RefreshTokenService()
export default refreshTokenService
