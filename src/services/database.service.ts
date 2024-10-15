import dotenv from 'dotenv'
import { Collection, Db, MongoClient } from 'mongodb'
import { envConfig, TEnvironment } from '~/constants/config'
import { BookmarkSchema } from '~/models/schemas/Bookmark.schema'
import Follower from '~/models/schemas/Follower.schema'
import { HashTags } from '~/models/schemas/HashTags.schema'
import { LikeSchema } from '~/models/schemas/Like.schema'
import { RefreshToken } from '~/models/schemas/RefershToken.schema'
import Tweet from '~/models/schemas/Tweet.schema'
import User from '~/models/schemas/User.schema'
import argv from 'minimist'
import { HabitsSchema } from '~/models/schemas/Habit.schema'

dotenv.config()

const options = argv(process.argv.slice(2))
const env = (options.env as TEnvironment) ?? 'development'

const uri = `mongodb+srv://${envConfig.dbUsername}:${envConfig.dbPassword}@cluster0.s9ypdsa.mongodb.net/${envConfig.dbName}?retryWrites=true&w=majority`
const uriDev = `mongodb://localhost:27017/${envConfig.dbName}`

// level pro
export default class DatabaseConnect {
  private client: MongoClient
  private db: Db
  private static _instance: DatabaseConnect

  constructor() {
    this.client = new MongoClient(env !== 'development' ? uri : uriDev)
    this.db = this.client.db(envConfig.dbName)
    this.connect()
  }

  // ** check db exist
  async checkAndCreateDB() {
    const admin = this.db.admin()
    const databases = await admin.listDatabases()
    const dbNames = databases.databases.map((database) => database.name)

    if (dbNames.includes(envConfig.dbName)) {
      console.log(`Database '${envConfig.dbName}' đã tồn tại.`)
    } else {
      console.log(`Database '${envConfig.dbName}' chưa tồn tại. Đang tạo...`)

      // Tạo một collection để kích hoạt việc tạo database
      const collectionName = envConfig.collectionUsers
      await this.db.createCollection(collectionName)
      console.log(`Database '${envConfig.dbName}' đã được tạo với collection '${collectionName}'.`)

      // Xóa collection khởi tạo nếu không cần thiết
      await this.db.collection(collectionName).drop()
      console.log(`Collection '${collectionName}' đã được xóa.`)
    }
  }

  // ** check exist collection in db
  async createCollections(collections: string[]) {
    const existingCollections = await this.db.listCollections().toArray()
    const existingNames = existingCollections.map((col) => col.name)

    for (const col of collections) {
      if (!existingNames.includes(col)) {
        try {
          await this.db.createCollection(col)
          console.log(`Collection '${col}' created.`)
        } catch (err) {
          console.error(`Error creating collection '${col}':`, err)
        }
      } else {
        console.log(`Collection '${col}' already exists.`)
      }
    }
  }

  async connect() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await this.client.connect()

      // ** check collection exist
      const requiredCollections = [
        envConfig.collectionUsers,
        envConfig.collectionBookmarks,
        envConfig.collectionFollower,
        envConfig.collectionHashTags,
        envConfig.collectionLikes,
        envConfig.collectionRefreshTokens,
        envConfig.collectionTweets,
        envConfig.collectionUsers,
        envConfig.collectionHabits
      ]
      await this.checkAndCreateDB()
      await this.createCollections(requiredCollections)

      // Send a ping to confirm a successful connection
      await this.client.db(envConfig.dbName).command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
      this.indexUser()
      this.indexRefreshTokens()
      this.indexFollowerUsers()
      // Ensures that the client will close when you finish/error
    } catch (err) {
      console.log('🚀 ~ file: database.service.ts:46 ~ DatabaseConnect ~ connect ~ err:', err)
    }
    // finally {
    //   await this.client.close()
    // }
  }

  async indexUser() {
    const isExist = await this.users.indexExists(['email_1', 'email_1_password_1', 'username_1'])

    if (!isExist) {
      this.users.createIndex({ email: 1 }, { unique: true })
      this.users.createIndex({ email: 1, password: 1 })
      this.users.createIndex({ username: 1 }, { unique: true })
    }
  }

  async indexRefreshTokens() {
    const isExist = await this.refreshTokens.indexExists(['exp_1', 'token_1'])

    if (!isExist) {
      this.refreshTokens.createIndex({ token: 1 })
      // time to life
      this.refreshTokens.createIndex({ exp: 1 }, { expireAfterSeconds: 0 })
    }
  }

  async indexFollowerUsers() {
    const isExist = await this.followers.indexExists(['user_id_1_followed_user_id_1'])

    if (!isExist) {
      this.followers.createIndex({ user_id: 1, followed_user_id: 1 })
    }
  }

  get users(): Collection<User> {
    return this.db.collection(envConfig.collectionUsers)
  }

  get tweets(): Collection<Tweet> {
    return this.db.collection(envConfig.collectionTweets)
  }

  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(envConfig.collectionRefreshTokens)
  }

  get followers(): Collection<Follower> {
    return this.db.collection(envConfig.collectionFollower)
  }

  get hashTags(): Collection<HashTags> {
    return this.db.collection(envConfig.collectionHashTags)
  }

  get bookmarks(): Collection<BookmarkSchema> {
    return this.db.collection(envConfig.collectionBookmarks)
  }

  get likes(): Collection<LikeSchema> {
    return this.db.collection(envConfig.collectionLikes)
  }

  get habits(): Collection<HabitsSchema> {
    return this.db.collection(envConfig.collectionHabits)
  }

  static getInstance() {
    if (!DatabaseConnect._instance) {
      DatabaseConnect._instance = new DatabaseConnect()
    }
    return DatabaseConnect._instance
  }
}

export const instanceDatabase = DatabaseConnect.getInstance
