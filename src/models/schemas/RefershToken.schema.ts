import { ObjectId } from 'mongodb'

export interface RefreshTokenType {
  _id?: ObjectId
  token: string
  user_id: ObjectId
  createdAt?: Date
  exp: number
  iat: number
}

export class RefreshToken {
  _id: ObjectId
  token: string
  user_id: ObjectId
  createdAt: Date
  exp: Date
  iat: Date

  constructor(refreshToken: RefreshTokenType) {
    this._id = refreshToken._id ?? new ObjectId()
    this.token = refreshToken.token
    this.user_id = refreshToken.user_id
    this.createdAt = refreshToken.createdAt ?? new Date()
    this.iat = new Date(refreshToken.iat * 1000)
    this.exp = new Date(refreshToken.exp * 1000)
  }
}
