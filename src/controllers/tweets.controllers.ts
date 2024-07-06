import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import HTTP_STATUS from '~/constants/httpStatus'
import { TokenPayload } from '~/models/schemas/requests/User.request'
import { TweetRequestBody } from '~/models/schemas/Tweet.schema'
import tweetsService from '~/services/tweets.service'

export const createTweetController = async (req: Request<ParamsDictionary, any, TweetRequestBody>, res: Response) => {
  const body = req.body
  const { user_id } = req.decoded_authorization as TokenPayload
  console.log({ body, user_id })
  const tweet = await tweetsService.createTweet(body, user_id)
  return res.status(HTTP_STATUS.CREATED).json({
    tweet
  })
}
