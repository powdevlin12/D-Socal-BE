import { RefreshToken, RefreshTokenType } from '~/models/schemas/RefershToken.schema'
import { instanceDatabase } from './database.service'

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
}

const refreshTokenService = new RefreshTokenService()
export default refreshTokenService
