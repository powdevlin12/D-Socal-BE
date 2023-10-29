import { NextFunction, Request, Response } from 'express'
import { pick } from 'lodash'

export const filterBody =
  <T>(filter: Array<keyof T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    req.body = pick(req.body, filter)
    next()
  }
