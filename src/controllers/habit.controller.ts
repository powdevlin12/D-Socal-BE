import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import HTTP_STATUS from '~/constants/httpStatus'
import { TBookmarkRequire } from '~/models/schemas/Bookmark.schema'
import { HabitsBodyType } from '~/models/schemas/Habit.schema'
import { TokenPayload } from '~/models/schemas/requests/User.request'
import habitService from '~/services/habit.service'

class HabitControllerClass {
  public async createBookmark(req: Request<ParamsDictionary, any, HabitsBodyType>, res: Response) {
    const { user_id } = req.decoded_authorization as TokenPayload
    const { habit_name } = req.body
    const result = await habitService.createHabit(user_id, habit_name)

    return res.status(HTTP_STATUS.CREATED).json(result)
  }
}

const habitController = new HabitControllerClass()
export default habitController
