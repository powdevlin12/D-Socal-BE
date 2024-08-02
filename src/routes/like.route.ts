import { Router } from 'express'
import likeCollection from '~/controllers/like.controller'
import { accessTokenValidator } from '~/middlewares/users.middleware'
import { wrapRequestHandler } from '~/utils/handlers'
import { validate } from '~/utils/validation'

export const likesRoute = Router()

likesRoute.post('/', validate(accessTokenValidator), wrapRequestHandler(likeCollection.createUserLikeTweet))
