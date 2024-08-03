import { LikeSchema, TLikeBody } from '~/models/schemas/Like.schema'
import { instanceDatabase } from './database.service'

class LikeService {
  public async createUserLikeTweet(user_id: string, body: Omit<TLikeBody, 'user_id'>) {
    const { tweet_id } = body
    const result = await instanceDatabase().likes.insertOne(new LikeSchema({ tweet_id, user_id }))

    const like = await instanceDatabase().likes.findOne({
      _id: result.insertedId
    })
    return like
  }
}

const likeService = new LikeService()
export default likeService
