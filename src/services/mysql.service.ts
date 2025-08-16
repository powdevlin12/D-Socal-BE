import mysql from 'mysql2/promise'
import { envConfig } from '~/constants/config'

export class MySQLService {
  private static instance: MySQLService
  private pool: mysql.Pool

  constructor() {
    this.pool = mysql.createPool({
      host: envConfig.mysqlHost,
      port: envConfig.mysqlPort,
      user: envConfig.mysqlUsername,
      password: envConfig.mysqlPassword,
      database: envConfig.mysqlDatabase,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      charset: 'utf8mb4'
    })
  }

  public static getInstance(): MySQLService {
    if (!MySQLService.instance) {
      MySQLService.instance = new MySQLService()
    }
    return MySQLService.instance
  }

  public async connect(): Promise<void> {
    try {
      const connection = await this.pool.getConnection()
      connection.release()
      console.log('✅ Connected to MySQL database successfully!')
      await this.createTables()
    } catch (error) {
      console.error('❌ Error connecting to MySQL:', error)
      throw error
    }
  }

  public async query(sql: string, params?: any[]): Promise<any> {
    try {
      const [results] = await this.pool.execute(sql, params)
      return results
    } catch (error) {
      console.error('❌ Error executing query:', error)
      throw error
    }
  }

  public async createTables(): Promise<void> {
    try {
      console.log('🔄 Creating database tables...')

      await this.query(`
        CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(100) PRIMARY KEY,
          name VARCHAR(255),
          email VARCHAR(100),
          password VARCHAR(100),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `)

      await this.query(`
        CREATE TABLE IF NOT EXISTS refresh_tokens (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id VARCHAR(100),
          token VARCHAR(255),
          iat DATETIME,
          exp DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `)

      await this.query(`
        CREATE TABLE IF NOT EXISTS company_info (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255),
          logo_url VARCHAR(500),
          intro_text TEXT,
          address VARCHAR(500),
          tax_code VARCHAR(50),
          email VARCHAR(255),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          welcome_content VARCHAR(500),
          version_info INT,
          contact_id INT,
          img_intro TEXT
        )
      `)

      await this.query(`
        CREATE TABLE IF NOT EXISTS contact_company (
          id INT AUTO_INCREMENT PRIMARY KEY,
          facebook_link VARCHAR(255),
          tiktok_link VARCHAR(255),
          zalo_link VARCHAR(255),
          phone VARCHAR(255),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `)

      await this.query(`
        CREATE TABLE IF NOT EXISTS services (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255),
          description TEXT,
          image_url VARCHAR(500),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          is_delete BOOLEAN DEFAULT FALSE,
          company_id INT
        )
      `)

      await this.query(`
        CREATE TABLE IF NOT EXISTS footer_links (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255),
          column_position INT,
          url VARCHAR(255),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          title_column VARCHAR(255)
        )
      `)

      await this.query(`
        CREATE TABLE IF NOT EXISTS contact_customer (
          id INT AUTO_INCREMENT PRIMARY KEY,
          full_name VARCHAR(100),
          phone_customer VARCHAR(11),
          message VARCHAR(500),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `)

      console.log('✅ All tables created successfully!')
    } catch (error) {
      console.error('❌ Error creating tables:', error)
      throw error
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await this.pool.end()
      console.log('✅ Disconnected from MySQL database')
    } catch (error) {
      console.error('❌ Error disconnecting from MySQL:', error)
    }
  }
}

export default MySQLService.getInstance()
