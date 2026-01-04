const db = require("../../model");
const User = db.user;
const Order = db.order; // assuming order model exists
const { Op } = require("sequelize");

exports.dashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count({ where: { role: "customer" } });
    const totalOrders = await Order.count();

    const todayOrders = await Order.count({
      where: {
        createdAt: {
          [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    });

    const totalRevenue = await Order.sum("total_amount", {
      where: { payment_status: "paid" },
    });

    res.json({
      success: true,
      data: {
        totalUsers,
        totalOrders,
        todayOrders,
        totalRevenue: totalRevenue || 0,
      },
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { role: "customer" },
      attributes: { exclude: ["password"] },
      order: [["createdAt", "DESC"]],
    });

    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};


exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.is_active = !user.is_active;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.is_active ? "activated" : "blocked"} successfully`,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
