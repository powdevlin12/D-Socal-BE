import { Request } from 'express'
import { getFileName, handleUploadImage } from '~/utils/file'
import sharp from 'sharp'
import { UPLOAD_FOLDER } from '~/constants/dir'
import path from 'path'
import fs from 'fs'
import { isProduction } from '~/constants/media'
import { MediaType } from '~/constants/enums'
class MediaService {
  async handleUploadImage(req: Request) {
    const files = await handleUploadImage(req)

    const data = await Promise.all(
      files.map(async (file) => {
        const newNameFile = getFileName(file.newFilename)
        await sharp(file.filepath)
          .jpeg({
            quality: 60
          })
          .toFile(path.resolve(UPLOAD_FOLDER, `${newNameFile}.jpg`))
        fs.unlinkSync(file.filepath)
        return {
          url: isProduction
            ? `${process.env.HOST}/upload/${newNameFile}.jpg`
            : `http://localhost:${process.env.PORT_SERVER}/upload/${newNameFile}.jpg`,
          type: MediaType.Image
        }
      })
    )

    return data
  }
}

const mediaService = new MediaService()

export default mediaService
