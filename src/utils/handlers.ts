import { NextFunction, Request, RequestHandler, Response } from 'express'

export const wrapRequestHandler = (func: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      func(req, res, next)
    } catch (error) {
      console.log('🚀 ~ file: handlers.ts:8 ~ return ~ error:', error)
      next(error)
    }
  }
}
