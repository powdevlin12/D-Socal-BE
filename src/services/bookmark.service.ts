import { BookmarkSchema } from '~/models/schemas/Bookmark.schema'
import { instanceDatabase } from './database.service'
import { ObjectId } from 'mongodb'

class BookmarkService {
  public createBookmark = async (userId: string, tweet_id: string) => {
    const result = await instanceDatabase().bookmarks.insertOne(
      new BookmarkSchema({
        tweet_id,
        user_id: userId
      })
    )
    const newBookmark = instanceDatabase().bookmarks.findOne({
      _id: result.insertedId
    })
    return newBookmark
  }

  public async unBookmark(bookmark_id: string) {
    const result = await instanceDatabase().bookmarks.findOneAndDelete({
      _id: new ObjectId(bookmark_id)
    })
    return result
  }
}

const bookmarkService = new BookmarkService()
export default bookmarkService
