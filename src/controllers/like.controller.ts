import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import HTTP_STATUS from '~/constants/httpStatus'
import { TLikeBody } from '~/models/schemas/Like.schema'
import { TokenPayload } from '~/models/schemas/requests/User.request'
import likeService from '~/services/like.service'

class LikeController {
  public async createUserLikeTweet(req: Request<ParamsDictionary, any, TLikeBody>, res: Response, next: NextFunction) {
    const { user_id } = req.decoded_authorization as TokenPayload
    const { tweet_id } = req.body
    const response = await likeService.createUserLikeTweet(user_id, {
      tweet_id
    })
    return res.status(HTTP_STATUS.CREATED).json({ response })
  }
}

const likeCollection = new LikeController()
export default likeCollection
