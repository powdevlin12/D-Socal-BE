import { RefreshToken, RefreshTokenType } from '~/models/schemas/RefershToken.schema'
import { instanceDatabase } from './database.service'

class RefreshTokenService {
  async createRefeshToken(refreshToken: RefreshTokenType) {
    const result = await instanceDatabase().refreshTokens.insertOne(new RefreshToken(refreshToken))
    return result
  }
}

const refreshTokenService = new RefreshTokenService()
export default refreshTokenService
