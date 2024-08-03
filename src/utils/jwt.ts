import { KeyObject } from 'crypto'
import { config } from 'dotenv'
import jwt, { SignOptions } from 'jsonwebtoken'
import { TokenPayload } from '~/models/schemas/requests/User.request'
config()

export const signToken = ({
  payload,
  privateKey,
  options = {
    algorithm: 'HS256'
  }
}: {
  payload: string | Buffer | object
  privateKey: string | Buffer | KeyObject | { key: string | Buffer; passphrase: string }
  options?: SignOptions
}) =>
  new Promise<string>((resolve, reject) =>
    jwt.sign(payload, privateKey, options, (err, token) => {
      if (err) {
        throw reject(err)
      }

      resolve(token as string)
    })
  )

export const verifyToken = ({ token, privateKey }: { token: string; privateKey?: string }) =>
  new Promise<TokenPayload>((resolve, reject) => {
    jwt.verify(token, privateKey as string, function (err, decoded) {
      if (err) {
        throw reject(err)
      }
      resolve(decoded as TokenPayload)
    })
  })
