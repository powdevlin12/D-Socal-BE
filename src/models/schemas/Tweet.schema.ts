import { ObjectId } from 'mongodb'

export enum TweetType {
  Tweet,
  ReTweet,
  Comment,
  QuoteTweet
}

export enum TweetAudience {
  Everyone, // 0
  TwitterCircle // 1
}
export interface TweetRequestBody {
  type: TweetType
  audience: TweetAudience
  content: string
  parent_id: null | string // chỉ null khi tweet gốc, không thì là tweet_id cha dạng string
  hashTags: string[] // tên của hashtag dạng ['js','ts']
  mentions: string[]
  // medias : Media[]
}

interface TweetConstructor {
  user_id: string
  type: TweetType
  audience: TweetAudience
  content: string
  parent_id: null | string // null only tweet original
  hashTags: ObjectId[]
  mentions: string[]
  // medias : Media[]
  guest_views: number
  user_views: number
  created_at?: Date
  updated_at?: Date
}

export default class Tweet {
  _id?: ObjectId
  user_id: ObjectId
  type: TweetType
  audience: TweetAudience
  content: string
  parent_id: null | ObjectId // null only tweet original
  hashTags: ObjectId[]
  mentions: ObjectId[]
  // medias : Media[]
  guest_views: number
  user_views: number
  created_at?: Date
  updated_at?: Date

  constructor({
    audience,
    content,
    guest_views,
    hashTags,
    mentions,
    parent_id,
    type,
    user_id,
    user_views,
    created_at,
    updated_at
  }: TweetConstructor) {
    const date = new Date()
    this._id = new ObjectId()
    this.user_id = new ObjectId(user_id)
    this.type = type
    this.audience = audience
    this.content = content
    this.parent_id = parent_id ? new ObjectId(parent_id) : null
    this.hashTags = hashTags
    this.mentions = mentions.map((mention) => new ObjectId(mention))
    this.guest_views = guest_views
    this.user_views = user_views
    this.created_at = created_at || date
    this.updated_at = updated_at || date
  }
}
