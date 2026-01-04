module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "users",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      full_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      email: {
        type: Sequelize.STRING(150),
        allowNull: true,
        unique: true,
        validate: {
          isEmail: true,
        },
      },

      phone: {
        type: Sequelize.STRING(15),
        allowNull: false,
        unique: true,
      },

      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      role: {
        type: Sequelize.ENUM("customer", "admin", "delivery"),
        defaultValue: "customer",
      },

      address: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      city: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },

      pincode: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },

      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },

      last_login: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "users",
      timestamps: true,     // createdAt, updatedAt
      underscored: true,    // snake_case columns
    }
  );

  return User;
};
