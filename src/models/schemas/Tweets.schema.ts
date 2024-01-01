import { ObjectId } from 'mongodb'
import { TweetAudience, TweetType } from '~/constants/enums'

interface TweetConstructorType {
  _id: ObjectId
  user_id?: ObjectId
  type: TweetType
  audience: TweetAudience
  content: string
  parent_id: null | ObjectId
  hashtags: ObjectId[]
  mentions: ObjectId[]
  // media: Media[]
  media: string | null
  guest_views: number
  user_views: number
  created_at?: Date
  updated_at?: Date
}

export default class Tweet {
  _id?: ObjectId
  user_id?: ObjectId
  type: TweetType
  audience: TweetAudience
  content: string
  parent_id: null | ObjectId
  hashtags: ObjectId[]
  mentions: ObjectId[]
  // media: Media[]
  media: string | null
  guest_views: number
  user_views: number
  created_at?: Date
  updated_at?: Date

  constructor({
    _id,
    audience,
    content,
    guest_views,
    hashtags,
    media,
    mentions,
    parent_id,
    type,
    user_views,
    created_at,
    updated_at,
    user_id
  }: TweetConstructorType) {
    const date = new Date()
    this._id = _id ?? new ObjectId()
    this.audience = audience
    this.content = content
    this.created_at = date ?? date
    this.guest_views = guest_views
    this.hashtags = hashtags
    this.media = media
    this.mentions = mentions
    this.parent_id = parent_id
    this.type = type
    this.updated_at = updated_at ?? date
    this.user_id = user_id
    this.user_views = user_views
  }
}
