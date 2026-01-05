module.exports = (sequelize, Sequelize) => {
  const Meal = sequelize.define(
    "meals",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      meal_type: {
        type: Sequelize.ENUM("breakfast", "lunch", "dinner", "premium", "special"),
        allowNull: false,
      },

      price: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },

      is_available: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },

      image_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      underscored: true,
    }
  );

  return Meal;
};
