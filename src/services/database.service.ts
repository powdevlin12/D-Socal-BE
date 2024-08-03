import dotenv from 'dotenv'
import { Collection, Db, MongoClient } from 'mongodb'
import { envConfig } from '~/constants/config'
import { BookmarkSchema } from '~/models/schemas/Bookmark.schema'
import Follower from '~/models/schemas/Follower.schema'
import { HashTags } from '~/models/schemas/HashTags.schema'
import { LikeSchema } from '~/models/schemas/Like.schema'
import { RefreshToken } from '~/models/schemas/RefershToken.schema'
import Tweet from '~/models/schemas/Tweet.schema'
import User from '~/models/schemas/User.schema'
dotenv.config()

const uri = `mongodb+srv://${envConfig.dbUsername}:${envConfig.dbPassword}@cluster0.s9ypdsa.mongodb.net/${envConfig.dbName}?retryWrites=true&w=majority`
// level pro
export default class DatabaseConnect {
  private client: MongoClient
  private db: Db
  private static _instance: DatabaseConnect

  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(envConfig.dbName)
    this.connect()
  }

  async connect() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await this.client.connect()
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

  static getInstance() {
    if (!DatabaseConnect._instance) {
      DatabaseConnect._instance = new DatabaseConnect()
    }
    return DatabaseConnect._instance
  }
}

export const instanceDatabase = DatabaseConnect.getInstance
