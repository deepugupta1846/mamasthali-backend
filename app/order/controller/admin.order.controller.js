const db = require("../../model");
const Order = db.order;

exports.getAllOrders = async (req, res) => {
  const orders = await Order.findAll({
    include: [{ model: db.user, attributes: ["full_name", "phone"] }],
    order: [["createdAt", "DESC"]],
  });

  res.json({ success: true, data: orders });
};


exports.updateOrderStatus = async (req, res) => {
  const { order_status, payment_status } = req.body;

  const order = await Order.findByPk(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  if (order_status) order.order_status = order_status;
  if (payment_status) order.payment_status = payment_status;

  await order.save();

  res.json({
    success: true,
    message: "Order updated successfully",
  });
};


exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.json({
      success: true,
      message: "Order status updated",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
