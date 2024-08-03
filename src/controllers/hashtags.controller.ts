import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import HTTP_STATUS from '~/constants/httpStatus'
import { HashTagsBody } from '~/models/schemas/HashTags.schema'
import hashTagsService from '~/services/hashtags.service'

class HashTagsControllerClass {
  public async createHashTags(req: Request<ParamsDictionary, any, HashTagsBody>, res: Response) {
    const hashtagsInsert = await hashTagsService.createHashTags(req.body)
    return res.status(HTTP_STATUS.OK).json(hashtagsInsert)
  }
}

const hashTagController = new HashTagsControllerClass()
export default hashTagController
