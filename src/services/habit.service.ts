import { BookmarkSchema } from '~/models/schemas/Bookmark.schema'
import { instanceDatabase } from './database.service'
import { ObjectId } from 'mongodb'
import { HabitsSchema } from '~/models/schemas/Habit.schema'

class HabitService {
  public createHabit = async (user_id: string, habit_name: string) => {
    const result = await instanceDatabase().habits.insertOne(
      new HabitsSchema({
        habit_name,
        user_id
      })
    )
    const newService = instanceDatabase().bookmarks.findOne({
      _id: result.insertedId
    })
    return newService
  }
}

const habitService = new HabitService()
export default habitService
