module.exports= {
  DB: process.env.DB_NAME || 'mamasthali',
  USER: process.env.DB_USER || 'root',
  PASSORD: process.env.DB_PASSWORD || 'admin',
  HOST: process.env.DB_HOST || '127.0.0.1',
  PORT: process.env.DB_PORT || 3306,
  dialect: 'mysql',
  innodb_log_file_size: '512M',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
}

