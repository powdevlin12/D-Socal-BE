import { checkSchema } from 'express-validator'
import { isEmpty } from 'lodash'
import { ObjectId } from 'mongodb'
import { TWEET_MESSAGE } from '~/constants/messages'
import { TweetAudience, TweetType } from '~/models/schemas/Tweet.schema'
import { convertEnumToNumber } from '~/utils/other'

export const createTweetsValidator = checkSchema({
  type: {
    isIn: {
      options: [convertEnumToNumber(TweetType)],
      errorMessage: TWEET_MESSAGE.TYPE_TWEET_IS_INVALID
    }
  },
  audience: {
    isIn: {
      options: [convertEnumToNumber(TweetAudience)],
      errorMessage: TWEET_MESSAGE.TYPE_AUDIENCE_IS_INVALID
    }
  },
  parent_id: {
    custom: {
      options: (value, { req }) => {
        const type = req.body.type as TweetType
        if (value) {
          if ([TweetType.QuoteTweet, TweetType.Comment, TweetType.ReTweet].includes(type) && !ObjectId.isValid(value)) {
            throw Error(TWEET_MESSAGE.PARENT_ID_INVALID)
          } else if (type === TweetType.Tweet && !!type) {
            throw Error(TWEET_MESSAGE.PARENT_ID_MUST_BE_NULL)
          }
        }
        return true
      }
    }
  },
  content: {
    custom: {
      options: (value, { req }) => {
        const { type, mentions, hashTags } = req.body
        if (type === TweetType.ReTweet && !!value) {
          throw Error(TWEET_MESSAGE.CONTENT_MUST_BE_EMPTY)
        } else if (
          [TweetType.QuoteTweet, TweetType.Comment, TweetType.Tweet].includes(type) &&
          !isEmpty(mentions) &&
          !isEmpty(hashTags) &&
          !isEmpty(value)
        ) {
          throw Error(TWEET_MESSAGE.CONTENT_IS_NOT_EMPTY)
        }
        return true
      }
    }
  },
  hashTags: {
    custom: {
      options: (value, { req }) => {
        const isNotArrayString = (value as Array<any>).some((item) => typeof item !== 'string')
        if (isNotArrayString) {
          throw Error(TWEET_MESSAGE.HASH_TAGS_IS_ARRAY_OF_STRING)
        }
        return true
      }
    }
  },
  mentions: {
    custom: {
      options: (value, { req }) => {
        const isNotArrayOfObjectId = (value as Array<any>).some((item) => !ObjectId.isValid(item))
        if (isNotArrayOfObjectId) {
          throw Error(TWEET_MESSAGE.MENTIONS_IS_ARRAY_OF_OBJECT_ID)
        }
        return true
      }
    }
  }
})
