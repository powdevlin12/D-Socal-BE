import { existsSync, mkdirSync } from 'fs'
import formidable, { File } from 'formidable'
import { Request } from 'express'
import { isEmpty } from 'lodash'
import { UPLOAD_IMG_TEMP_FOLDER, UPLOAD_VIDEO_FOLDER, UPLOAD_VIDEO_TEMP_FOLDER } from '~/constants/dir'

export const initFolder = () => {
  ;[UPLOAD_VIDEO_TEMP_FOLDER, UPLOAD_IMG_TEMP_FOLDER].map((dir) => {
    if (!existsSync(dir)) {
      mkdirSync(dir, {
        recursive: true // create nested folders ex : uploads/images
      })
    }
  })
}

export const getFileName = (fullname: string): string => {
  const arrName = fullname.split('.')
  return arrName[0]
}

export const handleUploadImage = async (req: Request) => {
  const form = formidable({
    uploadDir: UPLOAD_IMG_TEMP_FOLDER,
    maxFiles: 4,
    keepExtensions: true,
    maxFileSize: 300 * 1024,
    maxTotalFileSize: 300 * 1024 * 4,
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'image' && Boolean(mimetype?.includes('image/'))
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any)
      }

      return valid
    }
  })

  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err)
      }

      if (isEmpty(files)) {
        reject(new Error('File type is not empty'))
      }

      resolve(files.image as File[])
    })
  })
}

export const handleUploadVideo = async (req: Request) => {
  const form = formidable({
    uploadDir: UPLOAD_VIDEO_FOLDER,
    maxFiles: 1,
    keepExtensions: true,
    maxFileSize: 50 * 1024 * 1024,
    maxTotalFileSize: 50 * 1024 * 1024 * 1,
    filter: function ({ name, originalFilename, mimetype }) {
      // const valid = name === 'image' && Boolean(mimetype?.includes('image/'))
      // if (!valid) {
      //   form.emit('error' as any, new Error('File type is not valid') as any)
      // }

      // return valid
      return true
    }
  })

  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      console.log('🚀 ~ file: file.ts:74 ~ form.parse ~ files:', files)
      if (err) {
        reject(err)
      }

      if (isEmpty(files.video)) {
        reject(new Error('File type is not empty'))
      }

      resolve(files.video as File[])
    })
  })
}
