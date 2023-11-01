import { existsSync, mkdirSync } from 'fs'
import path, { resolve } from 'path'
import formidable from 'formidable'
import { Request } from 'express'
import { isEmpty } from 'lodash'

export const initFolder = () => {
  if (!existsSync(path.resolve('uploads'))) {
    const uploadFolderPath = path.resolve('uploads')
    mkdirSync(uploadFolderPath, {
      recursive: true // create nested folders ex : uploads/images
    })
  }
}

export const handleUploadSingleImage = async (req: Request) => {
  const form = formidable({
    uploadDir: path.resolve('uploads'),
    maxFiles: 1,
    keepExtensions: true,
    maxFileSize: 300 * 1024,
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'image' && Boolean(mimetype?.includes('image/'))
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any)
      }

      return true
    }
  })

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      console.log('🚀 ~ file: file.ts:24 ~ form.parse ~ files:', files)
      console.log('🚀 ~ file: file.ts:24 ~ form.parse ~ fields:', fields)
      if (err) {
        console.log(err)
        return reject(err)
      }

      if (isEmpty(files)) {
        return reject(new Error('File type is not empty'))
      }
      resolve(files)
    })
  })
}
