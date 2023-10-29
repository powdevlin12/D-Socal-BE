import { NextFunction, Request, Response } from 'express'
import { ParamSchema, checkSchema } from 'express-validator'
import { JsonWebTokenError } from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
import { UserVerifyStatus } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { USER_MESSAGE } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import { instanceDatabase } from '~/services/database.service'
import userService from '~/services/user.service'
import { hashPassword } from '~/utils/cryto'
import { verifyToken } from '~/utils/jwt'
import { TokenPayload } from '../models/schemas/requests/User.request'

const passwordSchema: ParamSchema = {
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

const confirmPasswordSchema: ParamSchema = {
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
}

const forgotPasswordTokenSchema: ParamSchema = {
  custom: {
    options: async (value, { req }) => {
      if (!value) {
        throw new ErrorWithStatus({
          message: USER_MESSAGE.FORGOT_PASSWORD_TOKEN_IS_REQUIRED,
          status: HTTP_STATUS.UNAUTHORIZED
        })
      }
      try {
        const decoded_forgot_password_token = await verifyToken({
          token: value,
          privateKey: process.env.JWT_SECRET_FORGOT_PASSWORD_VERIFY_TOKEN as string
        })

        const { user_id } = decoded_forgot_password_token

        const user = await instanceDatabase().users.findOne({
          _id: new ObjectId(user_id)
        })

        if (!user) {
          throw new ErrorWithStatus({
            message: USER_MESSAGE.USER_NOT_FOUND,
            status: HTTP_STATUS.UNAUTHORIZED
          })
        }

        if (user.forgot_password_token !== value) {
          throw new ErrorWithStatus({
            message: USER_MESSAGE.FORGOT_PASSWORD_TOKEN_INVALID,
            status: HTTP_STATUS.UNAUTHORIZED
          })
        }

        req.decoded_forgot_password_token = decoded_forgot_password_token
        return true
      } catch (error) {
        if (error instanceof JsonWebTokenError) {
          throw new ErrorWithStatus({
            message: USER_MESSAGE.EMAIL_TOKEN_INVALID,
            status: HTTP_STATUS.UNAUTHORIZED
          })
        }
        throw error
      }
    }
  }
}

const nameSchema: ParamSchema = {
  notEmpty: {
    errorMessage: USER_MESSAGE.NAME_IS_REQUESTED
  },
  isLength: {
    options: {
      max: 100,
      min: 5
    },
    errorMessage: USER_MESSAGE.NAME_LENGTH_MUST_BE_FROM_5_TO_100
  },
  isString: true
}

const dateOfBirthSchema: ParamSchema = {
  isISO8601: {
    options: {
      strict: true,
      strictSeparator: true
    },
    errorMessage: USER_MESSAGE.DATE_OF_BIRTH_MUST_BE_IOS8601
  }
}

const imageSchema: ParamSchema = {
  optional: true,
  isString: true,
  isLength: {
    options: {
      max: 200,
      min: 10
    },
    errorMessage: USER_MESSAGE.PHOTO_MUST_BE_BETWEEN_10_AND_100_CHARACTERS_LONG
  },
  trim: true
}

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
        errorMessage: USER_MESSAGE.NAME_LENGTH_MUST_BE_FROM_5_TO_100
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
    password: passwordSchema,
    confirm_password: confirmPasswordSchema,
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
      custom: {
        options: async (value, { req }) => {
          try {
            const accessToken = (value || '').split(' ')[1]
            if (!accessToken) {
              throw new ErrorWithStatus({
                message: USER_MESSAGE.ACCCESS_TOKEN_IS_REQUESTED,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }

            const decoded_authorization = await verifyToken({
              token: accessToken,
              privateKey: process.env.JWT_SECRET_ACCESS_TOKEN
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
            throw error
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
      custom: {
        options: async (value, { req }) => {
          try {
            if (!value) {
              throw new ErrorWithStatus({
                message: USER_MESSAGE.REFRESH_TOKEN_IS_REQUESTED,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            const [decoded_refresh_token, refresh_token] = await Promise.all([
              verifyToken({ token: value, privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string }),
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
            ;(req as Request).decoded_refresh_authorization = decoded_refresh_token

            return true
          } catch (error) {
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

export const emailVerifyTokenValidator = checkSchema(
  {
    email_verify_token: {
      custom: {
        options: async (value, { req }) => {
          if (!value) {
            throw new ErrorWithStatus({
              message: USER_MESSAGE.EMAIL_VERIFY_TOKEN_IS_REQUESTED,
              status: HTTP_STATUS.UNAUTHORIZED
            })
          }
          try {
            const decoded_email_verify_token = await verifyToken({
              token: value,
              privateKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string
            })
            ;(req as Request).decoded_email_verify_token = decoded_email_verify_token
            return true
          } catch (error) {
            if (error instanceof JsonWebTokenError) {
              throw new ErrorWithStatus({
                message: USER_MESSAGE.EMAIL_TOKEN_INVALID,
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

export const forgotPasswordValidate = checkSchema(
  {
    email: {
      notEmpty: {
        errorMessage: USER_MESSAGE.EMAIL_IS_NOT_EMPTY
      },
      isEmail: {
        errorMessage: USER_MESSAGE.EMAIL_IS_NOT_VALID
      },
      custom: {
        options: async (value, { req }) => {
          const user = await instanceDatabase().users.findOne({
            email: value
          })

          if (!user) {
            throw new ErrorWithStatus({
              message: USER_MESSAGE.USER_NOT_FOUND,
              status: HTTP_STATUS.NOT_FOUND
            })
          }

          ;(req as Request).user = user
          return true
        }
      }
    }
  },
  ['body']
)

export const verifyForgotPasswordValidate = checkSchema(
  {
    forgot_password_token: forgotPasswordTokenSchema
  },
  ['body']
)

export const resetPasswordValidator = checkSchema({
  password: passwordSchema,
  confirm_password: confirmPasswordSchema,
  forgot_password_token: forgotPasswordTokenSchema
})

export const updateMeMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { verify } = req.decoded_authorization as TokenPayload

  if (verify !== UserVerifyStatus.Verified) {
    return next(
      new ErrorWithStatus({
        message: USER_MESSAGE.YOU_RE_NOT_FORBIDDEN,
        status: HTTP_STATUS.FORBIDDEN
      })
    )
  }

  next()
}

export const updateMeValidator = checkSchema(
  {
    name: {
      ...nameSchema,
      notEmpty: undefined
    },
    date_of_birth: {
      ...dateOfBirthSchema,
      optional: true,
      notEmpty: undefined
    },
    avatar: imageSchema,
    cover_photo: imageSchema,
    bio: {
      optional: true,
      isString: {
        errorMessage: USER_MESSAGE.BIO_MUST_BE_STRING
      },
      isLength: {
        options: {
          min: 10,
          max: 200
        },
        errorMessage: USER_MESSAGE.BIO_MUST_BE_BETWEEN_10_AND_200_CHARACTERS_LONG
      }
    },
    website: {
      optional: true,
      isString: {
        errorMessage: USER_MESSAGE.WEBSITE_MUST_BE_STRING
      },
      isLength: {
        options: {
          min: 10,
          max: 200
        },
        errorMessage: USER_MESSAGE.WEBSITE_MUST_BE_BETWEEN_10_AND_200_CHARACTERS_LONG
      }
    },
    location: {
      optional: true,
      isString: {
        errorMessage: USER_MESSAGE.LOCATION_MUST_BE_STRING
      },
      isLength: {
        options: {
          min: 10,
          max: 200
        },
        errorMessage: USER_MESSAGE.LOCATION_MUST_BE_BETWEEN_10_AND_200_CHARACTERS_LONG
      }
    },
    username: {
      optional: true,
      isString: {
        errorMessage: USER_MESSAGE.USERNAME_MUST_BE_STRING
      },
      isLength: {
        options: {
          min: 10,
          max: 100
        },
        errorMessage: USER_MESSAGE.USERNAME_MUST_BE_BETWEEN_10_AND_100_CHARACTERS_LONG
      }
    }
  },
  ['body']
)
