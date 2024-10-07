import { BookmarkSchema, TBookmarkRequire } from '~/models/schemas/Bookmark.schema'
import { instanceDatabase } from './database.service'

class BookmarkService {
  public createBookmark = async (userId: string, body: TBookmarkRequire) => {
    const { tweet_id, _id, create_at } = body
    console.log('🚀 ~ BookmarkService ~ createBookmark= ~ tweet_id:', tweet_id)
    const result = await instanceDatabase().bookmarks.insertOne(
      new BookmarkSchema({
        tweet_id,
        user_id: userId,
        _id,
        create_at
      })
    )
    const newBookmark = instanceDatabase().bookmarks.findOne({
      _id: result.insertedId
    })
    return newBookmark
  }

  // public async unBookmark() {
    
  // }
}

const bookmarkService = new BookmarkService()
export default bookmarkService
