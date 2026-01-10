const { Sequelize } = require('sequelize');
const config = require("../../config/db.config.js")
require('dotenv').config();

const sequelize = new Sequelize(
  config.DB,
    config.USER,
  config.PASSORD,
  {
    host: config.HOST,
    port: config.PORT,
    dialect: config.dialect,
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: true
      }
    }
  }
);

const db = {}

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../user/model/user.model.js")(sequelize, Sequelize)
db.order = require("../order/model/order.model.js")(sequelize, Sequelize);

db.user.hasMany(db.order, { foreignKey: "user_id" });
db.order.belongsTo(db.user, { foreignKey: "user_id" });

db.meal = require("../meal/model/meal.model.js")(sequelize, Sequelize);


module.exports = db;
