import { config } from 'dotenv'
import argv from 'minimist'

const options = argv(process.argv.slice(2))

type TEnvironment = 'production' | 'staging' | 'development'

const envVariable = {
  production: '.env.production',
  staging: '.env.staging',
  development: '.env.development'
}

config({
  path: envVariable[(options.env as TEnvironment) ?? 'development']
})

export const envConfig = {
  host: process.env.HOST as string,
  dbUsername: process.env.DB_USERNAME as string,
  dbPassword: process.env.DB_PASSWORD as string,
  dbName: process.env.DB_DATABASE as string,
  collectionUsers: process.env.DB_COLLECTION_USERS as string,
  collectionRefreshTokens: process.env.DB_COLLECTION_REFRESH_TOKENS as string,
  collectionFollower: process.env.DB_COLLECTION_FOLLOWER as string,
  portServer: process.env.PORT_SERVER as string,
  secretAccessToken: process.env.JWT_SECRET_ACCESS_TOKEN as string,
  secretRefreshToken: process.env.JWT_SECRET_REFRESH_TOKEN as string,
  secretEmailVerifyToken: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string,
  secretForgotPasswordVerifyToken: process.env.JWT_SECRET_FORGOT_PASSWORD_VERIFY_TOKEN as string,
  accessTokenExpireIn: process.env.ACCESS_TOKEN_EXPIRE_IN as string,
  refreshTokenExpireIn: process.env.REFRESH_TOKEN_EXPIRE_IN as string,
  emailVerifyTokenExprireIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRE_IN as string,
  forgotVerifyTokenExprireIn: process.env.FORGOT_PASSWORD_VERIFY_TOKEN_EXPIRE_IN as string,
  googleClientId: process.env.GOOGLE_CLIENT_ID as string,
  googleRedirectURI: process.env.GOOGLE_REDIRECT_URI as string,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  clientRedirectCallback: process.env.CLIENT_REDIRECT_CALLBACK as string
}
