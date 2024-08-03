import { ObjectId } from 'mongodb'

export interface HashTagsType {
  _id?: string
  name: string
  create_at?: Date
}

export interface HashTagsBody {
  name: string
}

export class HashTags {
  _id: ObjectId
  name: string
  created_at: Date

  constructor(hashTag: HashTagsType) {
    const date = new Date()
    this._id = hashTag._id ? new ObjectId(hashTag._id) : new ObjectId()
    this.name = hashTag.name
    this.created_at = hashTag?.create_at ?? date
  }
}
