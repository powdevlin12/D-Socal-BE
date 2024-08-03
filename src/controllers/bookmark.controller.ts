import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import HTTP_STATUS from '~/constants/httpStatus'
import { TBookmarkRequire } from '~/models/schemas/Bookmark.schema'
import { TokenPayload } from '~/models/schemas/requests/User.request'
import bookmarkService from '~/services/bookmark.service'

class BookmarkControllerClass {
  public async createBookmark(req: Request<ParamsDictionary, any, TBookmarkRequire>, res: Response) {
    const { user_id } = req.decoded_authorization as TokenPayload
    const result = await bookmarkService.createBookmark(user_id, req.body)

    return res.status(HTTP_STATUS.CREATED).json(result)
  }
}

const bookmarkController = new BookmarkControllerClass()
export default bookmarkController
