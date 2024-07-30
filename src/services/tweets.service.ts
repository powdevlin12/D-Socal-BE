import Tweet, { TweetRequestBody } from '~/models/schemas/Tweet.schema'
import { instanceDatabase } from './database.service'
import hashTagsService from './hashtags.service'
import { ObjectId, WithId } from 'mongodb'
import { HashTags } from '~/models/schemas/HashTags.schema'

class TweetsService {
  async checkHashTag(hashtags: string[]): Promise<(WithId<HashTags> | null)[]> {
    const hashtagsDocuments = Promise.all(
      hashtags.map((hashtag) => {
        return hashTagsService.createHashTagsCheckExist({ name: hashtag })
      })
    )

    return hashtagsDocuments
  }

  async createTweet(body: TweetRequestBody, user_id: string) {
    const { audience, content, hashTags, mentions, parent_id, type } = body

    const hashTagsNew = await this.checkHashTag(hashTags)

    const date = new Date()
    const tweet = new Tweet({
      audience,
      content,
      guest_views: 0,
      parent_id,
      mentions: [],
      hashTags: hashTagsNew?.map((item) => new ObjectId(item?._id)) ?? [],
      type,
      user_id,
      user_views: 0,
      created_at: date,
      updated_at: date
    })
    const result = await instanceDatabase().tweets.insertOne(tweet)

    const tweetsInsert = await instanceDatabase().tweets.findOne({
      _id: result.insertedId
    })

    return tweetsInsert
  }
}

const tweetsService = new TweetsService()
export default tweetsService
