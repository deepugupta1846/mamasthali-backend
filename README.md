# MamasThali Backend API

Backend API for MamasThali application built with Node.js, Express.js, and Sequelize ORM.

## Project Structure

```
mamasthali/
├── config/
│   └── database.js          # Database configuration
├── controllers/             # Business logic controllers
├── middleware/              # Custom middleware
├── models/                  # Sequelize models
├── routes/                  # Route definitions
├── model.js                 # Global model setup and associations
├── routers.js               # Route associations
├── server.js                # Main entry point
├── .env.example             # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   - Copy `.env.example` to `.env`
   - Update database credentials in `.env`

3. **Database Setup**
   - Create a MySQL database named `mamasthali_db` (or update DB_NAME in `.env`)
   - The application will automatically sync models on startup

4. **Run the Server**
   ```bash
   # Development mode (with nodemon)
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

- `GET /api/health` - Health check endpoint
- `GET /api/` - Root endpoint

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Sequelize** - SQL ORM
- **MySQL2** - MySQL driver
- **dotenv** - Environment variable management
- **CORS** - Cross-origin resource sharing

## Development

To add new features:

1. **Create a Model**: Add model file in `models/` directory
2. **Register Model**: Import and define in `model.js`
3. **Create Controller**: Add controller in `controllers/` directory
4. **Create Routes**: Add route file in `routes/` directory
5. **Register Routes**: Import and use in `routers.js`

## License

ISC

