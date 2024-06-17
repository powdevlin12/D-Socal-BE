import { Request } from 'express'
import { getFileName, handleUploadImage, handleUploadVideo } from '~/utils/file'
import sharp from 'sharp'
import { UPLOAD_IMG_FOLDER } from '~/constants/dir'
import path from 'path'
import fs from 'fs'
import { isProduction } from '~/constants/media'
import { MediaType } from '~/constants/enums'
import { envConfig } from '~/constants/config'
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
          .toFile(path.resolve(UPLOAD_IMG_FOLDER, `${newNameFile}.jpg`))
        fs.unlinkSync(file.filepath)
        return {
          url: isProduction
            ? `${envConfig.host}/statics/image/${newNameFile}.jpg`
            : `http://localhost:${envConfig.portServer}/statics/image/${newNameFile}.jpg`,
          type: MediaType.Image
        }
      })
    )

    return data
  }

  async handleUploadVideo(req: Request) {
    const file = await handleUploadVideo(req)
    const { newFilename } = file

    return {
      url: isProduction
        ? `${envConfig.host}/statics/video/${newFilename}`
        : `http://localhost:${envConfig.portServer}/statics/video/${newFilename}`,
      type: MediaType.Video
    }
  }
}

const mediaService = new MediaService()

export default mediaService
