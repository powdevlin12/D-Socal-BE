import { existsSync, mkdirSync } from 'fs'
import formidable, { File } from 'formidable'
import { Request } from 'express'
import { isEmpty } from 'lodash'
import { UPLOAD_TEMP_FOLDER } from '~/constants/dir'

export const initFolder = () => {
  if (!existsSync(UPLOAD_TEMP_FOLDER)) {
    mkdirSync(UPLOAD_TEMP_FOLDER, {
      recursive: true // create nested folders ex : uploads/images
    })
  }
}

export const handleUploadSingleImage = async (req: Request) => {
  const form = formidable({
    uploadDir: UPLOAD_TEMP_FOLDER,
    maxFiles: 1,
    keepExtensions: true,
    maxFileSize: 300 * 1024,
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'image' && Boolean(mimetype?.includes('image/'))
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any)
      }

      return valid
    }
  })

  return new Promise<File>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err)
      }

      if (isEmpty(files)) {
        reject(new Error('File type is not empty'))
      }

      console.log('🚀 ~ file: file.ts:34 ~ form.parse ~ files:', files)

      resolve((files.image as File[])[0])
    })
  })
}
