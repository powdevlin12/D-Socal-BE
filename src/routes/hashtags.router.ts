import { Router } from 'express'
import hashTagController from '~/controllers/hashtags.controller'
import { wrapRequestHandler } from '~/utils/handlers'

export const hashTagsRoute = Router()

hashTagsRoute.post('/', wrapRequestHandler(hashTagController.createHashTags))
