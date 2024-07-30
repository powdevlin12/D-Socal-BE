import { checkSchema } from 'express-validator'
import HTTP_STATUS from '~/constants/httpStatus'
import { HASH_TAG_MESSAGE } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import { instanceDatabase } from '~/services/database.service'

export const createHashTagsValidator = checkSchema(
  {
    name: {
      isLength: {
        options: {
          min: 3,
          max: 20
        },
        errorMessage: HASH_TAG_MESSAGE.HASH_TAG_LENGTH_IS_FROM_3_TO_20_CHARACTOR
      },
      custom: {
        options: async (value, { req }) => {
          const hashTagExist = await instanceDatabase().hashTags.findOne({
            name: (value as string).toLowerCase()
          })

          if (hashTagExist) {
            throw new ErrorWithStatus({
              message: HASH_TAG_MESSAGE.HASH_TAG_IS_EXIST,
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
