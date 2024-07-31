import { BookmarkSchema, TBookmarkRequire } from '~/models/schemas/Bookmark.schema'
import { instanceDatabase } from './database.service'

class BookmarkService {
  public createBookmark = async (userId: string, body: TBookmarkRequire) => {
    const { tweet_id, _id, create_at } = body
    const result = await instanceDatabase().bookmarks.insertOne(
      new BookmarkSchema({
        tweet_id,
        user_id: userId,
        _id,
        create_at
      })
    )

    return result
  }
}

const bookmarkService = new BookmarkService()
export default bookmarkService
