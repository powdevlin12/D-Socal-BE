import { Router } from 'express'
import bookmarkController from '~/controllers/bookmark.controller'
import { createBookmarkValidator } from '~/middlewares/bookmark.middleware'
import { accessTokenValidator } from '~/middlewares/users.middleware'
import { wrapRequestHandler } from '~/utils/handlers'
import { validate } from '~/utils/validation'

export const bookmarkRoute = Router()

bookmarkRoute.post(
  '/',
  validate(accessTokenValidator),
  validate(createBookmarkValidator),
  wrapRequestHandler(bookmarkController.createBookmark)
)

bookmarkRoute.delete('/', validate(accessTokenValidator), wrapRequestHandler(bookmarkController.unBookmark))
