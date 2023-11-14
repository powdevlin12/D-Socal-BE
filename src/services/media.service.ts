import { Request } from 'express'
import { getFileName, handleUploadSingleImage } from '~/utils/file'
import sharp from 'sharp'
import { UPLOAD_FOLDER } from '~/constants/dir'
import path from 'path'
import fs from 'fs'
import { isProduction } from '~/constants/media'
class MediaService {
  async handleUploadImage(req: Request) {
    const file = await handleUploadSingleImage(req)
    const newNameFile = getFileName(file.newFilename)
    const info = await sharp(file.filepath)
      .jpeg({
        quality: 60
      })
      .toFile(path.resolve(UPLOAD_FOLDER, `${newNameFile}.jpg`))
    fs.unlinkSync(file.filepath)
    return isProduction
      ? `${process.env.HOST}/upload/${newNameFile}.jpg`
      : `http://localhost:${process.env.PORT_SERVER}/upload/${newNameFile}.jpg`
  }
}

const mediaService = new MediaService()

export default mediaService
