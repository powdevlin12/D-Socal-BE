import { ObjectId } from 'mongodb'

export interface TLikeBody {
  _id?: string
  user_id: string
  tweet_id: string
}

export class LikeSchema {
  _id: ObjectId
  user_id: ObjectId
  tweet_id: ObjectId
  created_at: Date

  constructor({ tweet_id, user_id, _id }: TLikeBody) {
    this._id = _id ? new ObjectId(_id) : new ObjectId()
    this.user_id = new ObjectId(user_id)
    this.tweet_id = new ObjectId(tweet_id)
    this.created_at = new Date()
  }
}
