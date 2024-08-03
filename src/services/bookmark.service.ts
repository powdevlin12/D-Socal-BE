import { BookmarkSchema, TBookmarkRequire } from '~/models/schemas/Bookmark.schema'
import { instanceDatabase } from './database.service'

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
}

const bookmarkService = new BookmarkService()
export default bookmarkService
