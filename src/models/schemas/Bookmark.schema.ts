import { ObjectId } from 'mongodb'

export interface TBookmarkRequire {
  _id?: string
  user_id: string
  tweet_id: string
  create_at?: Date
}

export class BookmarkSchema {
  _id: ObjectId
  user_id: ObjectId
  tweet_id: ObjectId
  create_at: Date

  constructor(data: TBookmarkRequire) {
    const { tweet_id, user_id, create_at } = data
    this._id = new ObjectId()
    this.user_id = new ObjectId(user_id)
    this.tweet_id = new ObjectId(tweet_id)
    this.create_at = create_at ?? new Date()
  }
}
