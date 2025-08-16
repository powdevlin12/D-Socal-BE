interface UserTypes {
  id: string
  name: string
  email: string
  password: string
  created_at?: Date
  updated_at?: Date
}

export default class User {
  id: string
  name: string
  email: string
  password: string
  created_at: Date
  updated_at: Date

  constructor(user: UserTypes) {
    const date = new Date()
    ;((this.id = user.id ?? ''),
      (this.name = user.name ?? ''),
      (this.email = user.email ?? ''),
      (this.password = user.password),
      (this.created_at = user.created_at ?? date),
      (this.updated_at = user.updated_at ?? date))
  }
}
