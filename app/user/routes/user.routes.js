const userController = require("../controller/user.controller.js");
const auth = require("../../middleware/auth.middleware.js");

module.exports = (app) => {
    app.post("/api/v1/register", userController.register);
    app.post("/api/v1/login", userController.login);
    app.get("/api/v1/profile", auth, userController.getProfile);
    app.put("/api/v1/profile", auth, userController.updateProfile);
}
