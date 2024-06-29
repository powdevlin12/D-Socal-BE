import { Router } from 'express'
import { createTweetController } from '~/controllers/tweets.controllers'
import { createTweetsValidator } from '~/middlewares/tweets.middleware'
import { wrapRequestHandler } from '~/utils/handlers'
import { validate } from '~/utils/validation'

const tweetRouter = Router()

tweetRouter.post('/', validate(createTweetsValidator), wrapRequestHandler(createTweetController))

export default tweetRouter
