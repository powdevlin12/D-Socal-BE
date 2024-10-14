import { Router } from 'express'
import likeCollection from '~/controllers/like.controller'
import { createLikeValidator } from '~/middlewares/like.middleware'
import { accessTokenValidator } from '~/middlewares/users.middleware'
import asyncHandler from '~/utils/handler'
import { wrapRequestHandler } from '~/utils/handlers'
import { validate } from '~/utils/validation'

export const likesRoute = Router()

likesRoute.post(
  '/',
  validate(accessTokenValidator),
  validate(createLikeValidator),
  wrapRequestHandler(likeCollection.createUserLikeTweet)
)

likesRoute.post(
  '/test',
  validate(accessTokenValidator),
  // validate(createLikeValidator),
  asyncHandler(likeCollection.createUserLikeTweet)
)

likesRoute.delete('/', validate(accessTokenValidator), wrapRequestHandler(likeCollection.unlike))
