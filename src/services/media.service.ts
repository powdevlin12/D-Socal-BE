import { Request } from 'express'
import { getFileName, handleUploadSingleImage } from '~/utils/file'
import sharp from 'sharp'
import { UPLOAD_FOLDER } from '~/constants/dir'
import path from 'path'
import fs from 'fs'
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
    return info
  }
}

const mediaService = new MediaService()

export default mediaService
