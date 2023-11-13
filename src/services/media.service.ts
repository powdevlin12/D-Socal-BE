import { Request } from 'express'
import { handleUploadSingleImage } from '~/utils/file'
import sharp from 'sharp'
import { UPLOAD_TEMP_FOLDER } from '~/constants/dir'

class MediaService {
  async handleUploadImage(req: Request) {
    const file = await handleUploadSingleImage(req)
    // console.log('🚀 ~ file: media.service.ts:9 ~ MediaService ~ handleUploadImage ~ file:', file)
    // const info = sharp(file.filepath).jpeg({}).toFile('test.jpg')

    return file
  }
}

const mediaService = new MediaService()

export default mediaService
