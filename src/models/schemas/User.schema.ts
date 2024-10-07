import { ObjectId } from 'mongodb'
import { UserVerifyStatus } from '~/constants/enums'

interface UserTypes {
  _id?: ObjectId
  name: string
  email: string
  password: string
  date_of_birth: Date
  created_at?: Date
  updated_at?: Date
  email_verify_token?: string
  forgot_password_token?: string
  verify?: UserVerifyStatus
  twiter_cicler?: string[] // ** audience là twitter cicle thì những id ở trong twitter circle này mới được coi bài đăng
  bio?: string
  location?: string
  website?: string
  username?: string
  avatar?: string
  cover_photo?: string
}

export default class User {
  _id: ObjectId
  name: string
  email: string
  password: string
  date_of_birth: Date
  created_at: Date
  updated_at: Date
  email_verify_token: string
  forgot_password_token: string
  verify: UserVerifyStatus
  twiter_cicler: string[]
  bio: string
  location: string
  website: string
  username: string
  avatar: string
  cover_photo: string

  constructor(user: UserTypes) {
    const date = new Date()
    ;(this._id = user._id ?? new ObjectId()),
      (this.name = user.name ?? ''),
      (this.email = user.email ?? ''),
      (this.password = user.password),
      (this.date_of_birth = user.date_of_birth ?? date),
      (this.created_at = user.created_at ?? date),
      (this.updated_at = user.updated_at ?? date),
      (this.email_verify_token = user.email_verify_token ?? ''),
      (this.forgot_password_token = user.forgot_password_token ?? ''),
      (this.verify = user.verify ?? UserVerifyStatus.Unverified),
      (this.bio = user.bio ?? ''),
      (this.location = user.location ?? ''),
      (this.website = user.website ?? ''),
      (this.username = user.username ?? user.email ?? ''),
      (this.avatar = user.avatar ?? ''),
      (this.cover_photo = user.cover_photo ?? '')
    this.twiter_cicler = user?.twiter_cicler ?? []
  }
}
