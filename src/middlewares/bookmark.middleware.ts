import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'
import { TokenPayload } from '~/models/schemas/requests/User.request'
import { instanceDatabase } from '~/services/database.service'

export const createBookmarkValidator = checkSchema(
  {
    tweet_id: {
      custom: {
        options: async (value, { req }) => {
          const { user_id } = req.decoded_authorization as TokenPayload

          const tweet = await instanceDatabase().tweets.findOne({
            _id: new ObjectId(value)
          })

          if (!tweet) {
            throw new ErrorWithStatus({
              message: 'Tweet is not exist',
              status: HTTP_STATUS.NOT_FOUND
            })
          }

          const bookmark = await instanceDatabase().bookmarks.findOne({
            user_id: new ObjectId(user_id),
            tweet_id: new ObjectId(value)
          })

          if (bookmark) {
            throw new ErrorWithStatus({
              message: 'User bookmarked this tweet',
              status: HTTP_STATUS.BAD_REQUEST
            })
          }
          return true
        }
      }
    }
  },
  ['body']
)
