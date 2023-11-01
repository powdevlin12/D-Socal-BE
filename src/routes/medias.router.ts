import { Router } from 'express'
import { uploadSingleImageController } from '~/controllers/medias.controller'

const mediasRouter = Router()

mediasRouter.post('/upload-image', uploadSingleImageController)

export default mediasRouter
