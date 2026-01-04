const userController = require("../controller/user.controller.js");
const adminUserController = require("../controller/admin.user.controller.js");
const auth = require("../../middleware/auth.middleware.js");
const admin = require("../../middleware/admin.middleware.js");

module.exports = (app) => {
    // User routes
    app.post("/api/v1/register", userController.register);
    app.post("/api/v1/login", userController.login);
    app.get("/api/v1/profile", auth, userController.getProfile);
    app.put("/api/v1/profile", auth, userController.updateProfile);
    
    // Admin user routes
    app.get("/api/v1/admin/dashboard/stats", auth, admin, adminUserController.dashboardStats);
    app.get("/api/v1/admin/user", auth, admin, adminUserController.getAllUsers);
    app.put("/api/v1/admin/user/:id/toggle", auth, admin, adminUserController.toggleUserStatus);
}
