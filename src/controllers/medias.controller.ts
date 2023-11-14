import { NextFunction, Request, Response } from 'express'
import { MEDIA_MESSAGE } from '~/constants/messages'
import mediaService from '~/services/media.service'
export const uploadImageController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const url = await mediaService.handleUploadImage(req)

    return res.json({
      url,
      message: MEDIA_MESSAGE.UPLOAD_IMAGE_SUCCESSFULLY
    })
  } catch (error) {
    next(error)
  }
}
