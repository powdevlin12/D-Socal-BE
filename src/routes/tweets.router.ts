import { Router } from 'express'
import { createTweetController, getTweetDetail } from '~/controllers/tweets.controllers'
import { createTweetsValidator } from '~/middlewares/tweets.middleware'
import { accessTokenValidator, isUserLoginInVallidator } from '~/middlewares/users.middleware'
import { wrapRequestHandler } from '~/utils/handlers'
import { validate } from '~/utils/validation'

const tweetRouter = Router()

tweetRouter.post(
  '/',
  validate(createTweetsValidator),
  validate(accessTokenValidator),
  wrapRequestHandler(createTweetController)
)

// tweetRouter.get('/:tweet_id', isUserLoginInVallidator(accessTokenValidator), wrapRequestHandler(getTweetDetail))

export default tweetRouter
