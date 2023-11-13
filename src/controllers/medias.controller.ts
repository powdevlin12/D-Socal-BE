import { NextFunction, Request, Response } from 'express'
import mediaService from '~/services/media.service'
export const uploadSingleImageController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await mediaService.handleUploadImage(req)

    return res.json({
      result: data
    })
  } catch (error) {
    next(error)
  }
}
