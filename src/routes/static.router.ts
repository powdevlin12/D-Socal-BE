import { Router } from 'express'
import { serveImageController, serveVideoController } from '~/controllers/medias.controller'

const staticsRouter = Router()

staticsRouter.get('/image/:name', serveImageController)
staticsRouter.get('/video/:name', serveVideoController)

export default staticsRouter
