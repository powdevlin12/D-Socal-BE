import { Router } from 'express'
import bookmarkController from '~/controllers/bookmark.controller'
import { accessTokenValidator } from '~/middlewares/users.middleware'
import { wrapRequestHandler } from '~/utils/handlers'
import { validate } from '~/utils/validation'

export const bookmarkRoute = Router()

bookmarkRoute.post('/', validate(accessTokenValidator), wrapRequestHandler(bookmarkController.createBookmark))
