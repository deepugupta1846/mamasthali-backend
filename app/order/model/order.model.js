module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define(
    "orders",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      order_type: {
        type: Sequelize.ENUM("single", "subscription"),
        defaultValue: "single",
      },

      meal_type: {
        type: Sequelize.ENUM("breakfast", "lunch", "dinner"),
        allowNull: false,
      },

      quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },

      delivery_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },

      delivery_time: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },

      address: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      total_amount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },

      payment_status: {
        type: Sequelize.ENUM("pending", "paid", "failed"),
        defaultValue: "pending",
      },

      order_status: {
        type: Sequelize.ENUM(
          "placed",
          "confirmed",
          "preparing",
          "out_for_delivery",
          "delivered",
          "cancelled"
        ),
        defaultValue: "placed",
      },
    },
    {
      timestamps: true,
      underscored: true,
    }
  );

  return Order;
};
