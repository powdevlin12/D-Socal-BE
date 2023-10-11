import { KeyObject } from 'crypto'
import jwt, { SignOptions } from 'jsonwebtoken'

const signToken = ({
  payload,
  privateKey = process.env.JWT_SECRET as string,
  options
}: {
  payload: string | Buffer | object
  privateKey: string | Buffer | KeyObject | { key: string | Buffer; passphrase: string }
  options: SignOptions
}) =>
  new Promise<string>((resolve, reject) =>
    jwt.sign(payload, privateKey, options, (err, token) => {
      if (err) {
        throw reject(err)
      }

      resolve(token as string)
    })
  )
