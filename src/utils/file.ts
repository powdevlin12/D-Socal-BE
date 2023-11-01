import { existsSync, mkdirSync } from 'fs'
import path from 'path'

export const initFolder = () => {
  if (!existsSync(path.resolve('uploads'))) {
    const uploadFolderPath = path.resolve('uploads')
    mkdirSync(uploadFolderPath, {
      recursive: true // create nested folders ex : uploads/images
    })
  }
}
