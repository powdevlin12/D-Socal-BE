import { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'

export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({
      message: 'Please provide an email and password'
    })
  }

  return next()
}

export const registerValidator = checkSchema({
  name: {
    notEmpty: true,
    isLength: {
      options: {
        max: 255,
        min: 10
      }
    },
    isString: true,
    trim: true
  },
  email: {
    notEmpty: true,
    trim: true,
    isEmail: true
  },
  password: {
    errorMessage: 'Password not strong',
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
          throw new Error('Confirm password does not match')
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
      }
    }
  }
})
