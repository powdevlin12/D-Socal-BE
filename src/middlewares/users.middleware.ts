import { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'
import { JsonWebTokenError } from 'jsonwebtoken'
import HTTP_STATUS from '~/constants/httpStatus'
import { USER_MESSAGE } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import { instanceDatabase } from '~/services/database.service'
import userService from '~/services/user.service'
import { hashPassword } from '~/utils/cryto'
import { verifyToken } from '~/utils/jwt'

export const loginValidator = checkSchema(
  {
    email: {
      notEmpty: {
        errorMessage: USER_MESSAGE.EMAIL_IS_NOT_EMPTY
      },
      trim: true,
      isEmail: {
        errorMessage: USER_MESSAGE.EMAIL_IS_NOT_VALID
      },
      custom: {
        options: async (value: string, { req }) => {
          const user = await instanceDatabase().users.findOne({
            email: value,
            password: hashPassword(req.body.password)
          })
          if (!user) throw new Error(USER_MESSAGE.EMAIL_OR_PASSWORD_INCORRECT)
          req.user = user
          return true
        }
      }
    },
    password: {
      notEmpty: true,
      isString: true,
      isLength: {
        options: {
          min: 8,
          max: 50
        },
        errorMessage: USER_MESSAGE.PASSWORD_MUST_BE_FROM_8_TO_50
      },
      isStrongPassword: {
        options: {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minSymbols: 1,
          minNumbers: 1
        },
        errorMessage: USER_MESSAGE.PASSWORD_MUST_BE_STRONG
      }
    }
  },
  ['body']
)

export const registerValidator = checkSchema(
  {
    name: {
      notEmpty: {
        errorMessage: USER_MESSAGE.NAME_IS_REQUESTED
      },
      isLength: {
        options: {
          max: 100,
          min: 10
        },
        errorMessage: USER_MESSAGE.NAME_LENGTH_MUST_BE_FROM_1_TO_100
      },
      isString: true,
      trim: true
    },
    email: {
      notEmpty: {
        errorMessage: USER_MESSAGE.EMAIL_IS_NOT_EMPTY
      },
      trim: true,
      isEmail: {
        errorMessage: USER_MESSAGE.EMAIL_IS_NOT_VALID
      },
      custom: {
        options: async (value: string) => {
          const result = await userService.checkExistEmail(value)
          if (result) throw new Error(USER_MESSAGE.EMAIL_IS_ALREADY_IN_USE)
          return true
        }
      }
    },
    password: {
      notEmpty: true,
      isString: true,
      isLength: {
        options: {
          min: 8,
          max: 50
        },
        errorMessage: USER_MESSAGE.PASSWORD_MUST_BE_FROM_8_TO_50
      },
      isStrongPassword: {
        options: {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minSymbols: 1,
          minNumbers: 1
        },
        errorMessage: USER_MESSAGE.PASSWORD_MUST_BE_STRONG
      }
    },
    confirm_password: {
      notEmpty: true,
      isString: true,
      isLength: {
        options: {
          min: 8,
          max: 50
        }
      },
      isStrongPassword: {
        options: {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minSymbols: 1,
          minNumbers: 1
        }
      },
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.password) {
            throw new ErrorWithStatus({ message: USER_MESSAGE.PASSWORD_NOT_MATCH, status: HTTP_STATUS.NOT_FOUND })
          }
          return true
        }
      }
    },
    date_of_birth: {
      isISO8601: {
        options: {
          strict: true,
          strictSeparator: true
        },
        errorMessage: USER_MESSAGE.DATE_OF_BIRTH_MUST_BE_IOS8601
      }
    }
  },
  ['body']
)

export const accessTokenValidator = checkSchema(
  {
    Authorization: {
      notEmpty: {
        errorMessage: USER_MESSAGE.ACCCESS_TOKEN_IS_REQUESTED
      },
      custom: {
        options: async (value, { req }) => {
          try {
            const accessToken = value.split(' ')[1]
            console.log('🚀 ~ file: users.middleware.ts:162 ~ options: ~ accessToken:', value, accessToken)
            if (!accessToken)
              throw new ErrorWithStatus({
                message: USER_MESSAGE.ACCESS_TOKEN_INVALID,
                status: HTTP_STATUS.UNAUTHORIZED
              })

            const decoded_authorization = await verifyToken({
              token: accessToken
            })
            ;(req as Request).decoded_authorization = decoded_authorization
            return true
          } catch (error) {
            if (error instanceof JsonWebTokenError) {
              throw new ErrorWithStatus({
                message: error.message,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
          }
        }
      }
    }
  },
  ['headers']
)

export const refreshTokenValidator = checkSchema(
  {
    refreshToken: {
      notEmpty: {
        errorMessage: USER_MESSAGE.REFRESH_TOKEN_IS_REQUESTED
      },
      isString: {
        errorMessage: USER_MESSAGE.REFRESH_TOKEN_INVALID
      },
      custom: {
        options: async (value, { req }) => {
          try {
            const [decoded_refresh_token, refresh_token] = await Promise.all([
              verifyToken({ token: value }),
              instanceDatabase().refreshTokens.findOne({
                token: value
              })
            ])

            if (!refresh_token) {
              throw new ErrorWithStatus({
                message: USER_MESSAGE.USED_REFRESH_TOKEN_OR_NOT_EXIST,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            ;(req as Request).decoded_refresh_token = decoded_refresh_token

            return true
          } catch (error) {
            console.log('🚀 ~ file: users.middleware.ts:209 ~ options: ~ error:', error)
            if (error instanceof JsonWebTokenError) {
              throw new ErrorWithStatus({
                message: USER_MESSAGE.REFRESH_TOKEN_INVALID,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            throw error
          }
        }
      }
    }
  },
  ['body']
)
