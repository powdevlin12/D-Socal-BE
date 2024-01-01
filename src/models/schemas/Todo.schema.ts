import { ObjectId } from 'mongodb'

interface TodoTypes {
  _id?: ObjectId
  name: string
}

export default class Todo {
  _id: ObjectId
  name: string
  constructor(todo: TodoTypes) {
    this._id = todo?._id ?? new ObjectId()
    this.name = todo?.name
  }
}
