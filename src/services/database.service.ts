import { Collection, Db, MongoClient, ServerApiVersion } from 'mongodb'
import dotenv from 'dotenv'
import User from '~/models/schemas/User.schema'
import { RefreshToken } from '~/models/schemas/RefershToken.schema'
import Follower from '~/models/schemas/Follower.schema'
dotenv.config()

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.s9ypdsa.mongodb.net/${process.env.DB_DATABASE}?retryWrites=true&w=majority`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// level 0
// const client = new MongoClient(uri)

// export async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect()
//     // Send a ping to confirm a successful connection
//     await client.db(process.env.DB_DATABASE).command({ ping: 1 })
//     console.log('Pinged your deployment. You successfully connected to MongoDB!')
//     // Ensures that the client will close when you finish/error
//   } finally {
//     await client.close()
//   }
// }

// level pro
export default class DatabaseConnect {
  private client: MongoClient
  private db: Db
  private static _instance: DatabaseConnect

  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(process.env.DB_DATABASE)
    this.connect()
  }

  async connect() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await this.client.connect()
      // Send a ping to confirm a successful connection
      await this.client.db(process.env.DB_DATABASE).command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
      this.indexUser()
      // Ensures that the client will close when you finish/error
    } catch (err) {
      console.log('🚀 ~ file: database.service.ts:46 ~ DatabaseConnect ~ connect ~ err:', err)
    }
    // finally {
    //   await this.client.close()
    // }
  }

  indexUser() {
    this.users.createIndex({ email: 1 }, { unique: true })
    this.users.createIndex({ email: 1, password: 1 })
    this.users.createIndex({ username: 1 }, { unique: true })
  }

  get users(): Collection<User> {
    return this.db.collection(process.env.DB_COLLECTION_USERS as string)
  }

  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(process.env.DB_COLLECTION_REFRESH_TOKENS as string)
  }

  get followers(): Collection<Follower> {
    return this.db.collection(process.env.DB_COLLECTION_FOLLOWER as string)
  }

  static getInstance() {
    if (!DatabaseConnect._instance) {
      DatabaseConnect._instance = new DatabaseConnect()
    }
    return DatabaseConnect._instance
  }
}

export const instanceDatabase = DatabaseConnect.getInstance
