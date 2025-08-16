import { ObjectId } from 'mongodb'

export interface RefreshTokenType {
  id?: string
  token: string
  user_id: string
  createdAt?: Date
  exp: number
  iat: number
}

export class RefreshToken {
  id?: string
  token: string
  user_id: string
  createdAt: Date
  exp: Date
  iat: Date

  constructor(refreshToken: RefreshTokenType) {
    this.id = refreshToken?.id ?? ''
    this.token = refreshToken.token
    this.user_id = refreshToken.user_id
    this.createdAt = refreshToken.createdAt ?? new Date()
    this.iat = new Date(refreshToken.iat * 1000)
    this.exp = new Date(refreshToken.exp * 1000)
  }
}
