const db = require("../../model");
const Order = db.order;

exports.placeOrder = async (req, res) => {
  try {
    const {
      meal_type,
      quantity,
      delivery_date,
      delivery_time,
      address,
      total_amount,
      order_type,
    } = req.body;

    if (!meal_type || !delivery_date || !address || !total_amount) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const order = await Order.create({
      user_id: req.user.id,
      meal_type,
      quantity,
      delivery_date,
      delivery_time,
      address,
      total_amount,
      order_type,
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (error) {
    console.error("Order Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user.id },
      order: [["createdAt", "DESC"]],
    });

    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};


exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.order_status !== "placed") {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled",
      });
    }

    order.order_status = "cancelled";
    await order.save();

    res.json({
      success: true,
      message: "Order cancelled successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
