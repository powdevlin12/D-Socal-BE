import { Router } from 'express'
import { createTweetController } from '~/controllers/tweets.controllers'
import { accessTokenValidator } from '~/middlewares/users.middleware'
import { wrapRequestHandler } from '~/utils/handlers'
import { validate } from '~/utils/validation'

const tweetRouter = Router()

tweetRouter.post('/', validate(accessTokenValidator), wrapRequestHandler(createTweetController))

export default tweetRouter
