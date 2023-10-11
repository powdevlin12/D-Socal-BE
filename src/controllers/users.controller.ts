import { NextFunction, Request, Response } from 'express'
import { Result, ValidationError, matchedData, validationResult } from 'express-validator'
import User from '~/models/schemas/User.schema'
import { instanceDatabase } from '~/services/database.service'
import userService from '~/services/user.service'
import { ParamsDictionary } from 'express-serve-static-core'
import { RegisterRequestBody } from '~/models/schemas/requests/User.request'

export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body
  if (email === 'trandat' && password === '123') {
    return res.status(200).json({
      message: 'Login successful'
    })
  } else {
    return res.status(400).json({
      message: 'Login failed'
    })
  }
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterRequestBody>, res: Response) => {
  try {
    const result = await userService.register(req.body)
    if (result) {
      return res.status(200).json({
        message: 'Created successfully',
        result
      })
    }
  } catch (error) {
    console.log('🚀 ~ file: users.controller.ts:35 ~ registerController ~ error:', error)
    return res.status(500).json({
      error
    })
  }
}

export const testValidatorController = (req: Request, res: Response, next: NextFunction) => {
  const result = validationResult(req)
  if (result.isEmpty()) {
    const data = matchedData(req)
    console.log('🚀 ~ file: users.controller.ts:46 ~ testValidatorController ~ data:', data)
    return res.status(200).json({
      message: data.name
    })
  }
  console.log(`Hello ${req.query?.name}`)
  return res.status(400).json({
    message: 'Error'
  })
}
