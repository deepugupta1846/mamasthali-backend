const userOrder = require("../controller/user.order.controller.js");
const adminOrder = require("../controller/admin.order.controller.js");
const auth = require("../../middleware/auth.middleware.js");
const admin = require("../../middleware/admin.middleware.js");

module.exports = (app) => {
    // USER
    app.post("/api/v1/order/", auth, userOrder.placeOrder);
    app.get("/api/v1/my-order", auth, userOrder.getMyOrders);
    app.put("/api/v1/order/:id/cancel", auth, userOrder.cancelOrder);

    // ADMIN
    app.get("/api/v1/admin/order/", auth, admin, adminOrder.getAllOrders);
    app.put("/api/v1/admin/order/:id", auth, admin, adminOrder.updateOrderStatus);
}
