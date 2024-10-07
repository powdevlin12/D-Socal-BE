import { LikeSchema, TLikeBody } from '~/models/schemas/Like.schema'
import { instanceDatabase } from './database.service'
import { ObjectId } from 'mongodb'

class LikeService {
  public async createUserLikeTweet(user_id: string, body: Omit<TLikeBody, 'user_id'>) {
    const { tweet_id } = body
    const result = await instanceDatabase().likes.insertOne(new LikeSchema({ tweet_id, user_id }))

    const like = await instanceDatabase().likes.findOne({
      _id: result.insertedId
    })
    return like
  }

  public async unlike(like_id: string) {
    const result = await instanceDatabase().likes.findOneAndDelete({
      _id: new ObjectId(like_id)
    })
    return result
  }
}

const likeService = new LikeService()
export default likeService
