import { NextFunction, Request, Response } from 'express'
import { createReadStream, statSync } from 'fs'
import path from 'path'
import { UPLOAD_IMG_FOLDER, UPLOAD_VIDEO_FOLDER } from '~/constants/dir'
import HTTP_STATUS from '~/constants/httpStatus'
import { MEDIA_MESSAGE } from '~/constants/messages'
import mediaService from '~/services/media.service'
import mime from 'mime'

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

export const uploadVideoController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const url = await mediaService.handleUploadVideo(req)

    return res.json({
      url,
      message: MEDIA_MESSAGE.UPLOAD_IMAGE_SUCCESSFULLY
    })
  } catch (error) {
    next(error)
  }
}

export const serveImageController = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.params
  return res.sendFile(path.resolve(UPLOAD_IMG_FOLDER, name), (error) => {
    if (error) {
      res.status((error as any).statusCode).send('Not Found')
    }
  })
}

export const serveVideoController = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.params
  return res.sendFile(path.resolve(UPLOAD_VIDEO_FOLDER, name), (error) => {
    if (error) {
      res.status((error as any).statusCode).send('Not Found')
    }
  })
}

export const serveVideoStreamController = async (req: Request, res: Response, next: NextFunction) => {
  const range = req.headers.range

  if (!range) {
    return res.status(HTTP_STATUS.BAD_REQUEST).send('Request Range header')
  }

  const { name } = req.params
  const videoPath = path.resolve(UPLOAD_VIDEO_FOLDER, name)

  const videoSize = statSync(videoPath).size
  const chunkSize = 10 ** 6
  const start = Number(range.replace(/\D/g, ''))
  const end = Math.min(start + chunkSize, videoSize - 1)

  const contentLength = end - start + 1
  const contentType = mime.getType(videoPath) || 'video/*'

  const header = {
    'Content-Type': contentType,
    'Content-Length': contentLength,
    'Accept-Range': 'bytes',
    'Content-Range': `bytes ${start}-${end}/${videoSize}`
  }

  res.writeHead(HTTP_STATUS.PARTIAL_CONTENT, header)
  const videoStreams = createReadStream(videoPath, { start, end })
  videoStreams.pipe(res)
}
