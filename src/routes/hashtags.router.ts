import { Router } from 'express'
import hashTagController from '~/controllers/hashtags.controller'
import { createHashTagsValidator } from '~/middlewares/hashtags.middleware'
import { wrapRequestHandler } from '~/utils/handlers'
import { validate } from '~/utils/validation'

export const hashTagsRoute = Router()

hashTagsRoute.post('/', validate(createHashTagsValidator), wrapRequestHandler(hashTagController.createHashTags))
