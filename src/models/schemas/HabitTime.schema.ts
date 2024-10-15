import { ObjectId } from 'mongodb'

export interface HabitTimesType {
  _id?: string
  year: number
  month: number
  start_day_of_week: number
  num_day_of_month: number
}

export interface HabitTimesBodyType {
  year: number
  month: number
  start_day_of_week: number
  num_day_of_month: number
}

export class HabitTimes {
  _id: ObjectId
  year: number
  month: number
  start_day_of_week: number
  num_day_of_month: number

  constructor(habitTimeBody: HabitTimesBodyType) {
    const { month, num_day_of_month, start_day_of_week, year } = habitTimeBody
    this._id = new ObjectId()
    this.month = month
    this.num_day_of_month = num_day_of_month
    this.start_day_of_week = start_day_of_week
    this.year = year
  }
}
