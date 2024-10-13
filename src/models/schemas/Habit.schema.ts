import { ObjectId } from 'mongodb'

export interface HabitsType {
  _id?: string
  habit_name: string
  user_id: string
}

export interface HabitsBodyType {
  habit_name: string
  user_id: string
}

export class Habits {
  _id: ObjectId
  habit_name: string
  user_id: ObjectId

  constructor(habitBody: HabitsBodyType) {
    this._id = new ObjectId()
    this.habit_name = habitBody.habit_name
    this.user_id = new ObjectId(habitBody.user_id)
  }
}
