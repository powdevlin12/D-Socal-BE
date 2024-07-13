import { HashTags, HashTagsBody } from '~/models/schemas/HashTags.schema'
import { instanceDatabase } from './database.service'

class HashTagsService {
  public async createHashTags(body: HashTagsBody) {
    const { name } = body
    const hashTag = new HashTags({
      name: name.toLowerCase()
    })

    const result = await instanceDatabase().hashTags.insertOne(hashTag)

    const hashTagsInsert = await instanceDatabase().hashTags.findOne({
      _id: result.insertedId
    })

    return hashTagsInsert
  }
}

const hashTagsService = new HashTagsService()
export default hashTagsService
