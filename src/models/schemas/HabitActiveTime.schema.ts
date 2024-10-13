import { ObjectId } from 'mongodb'

export interface HabitActiveTimesType {
  _id?: string
  habit_id: string
  time_id: string
  time_active: number[]
}

export interface HabitActiveTimesBodyType {
  habit_id: string
  time_id: string
  time_active: number[]
}

export class HabitActiveTimes {
  _id: ObjectId
  habit_id: string
  time_id: string
  time_active: number[]

  constructor(habitActiveTimeBody: HabitActiveTimesBodyType) {
    const { habit_id, time_active, time_id } = habitActiveTimeBody
    this._id = new ObjectId()
    this.habit_id = habit_id
    this.time_id = time_id
    this.time_active = time_active
  }
}
