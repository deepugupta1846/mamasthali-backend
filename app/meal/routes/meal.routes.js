const userMeal = require("../controller/user.meal.controller.js");
const adminMeal = require("../controller/admin.meal.controller.js")
const auth = require("../../middleware/auth.middleware");
const admin = require("../../middleware/admin.middleware.js");
const upload = require("../../middleware/upload.middleware.js");

module.exports = (app) => {
    // USER
    app.get("/api/v1/meal", userMeal.getMenu);
    app.get("/api/v1/meal/:id", userMeal.getMealById);

    // ADMIN
    app.get("/api/v1/admin/meal/", auth, admin, adminMeal.getAllMeals);
    app.post("/api/v1/admin/meal/", auth, admin, upload.single('image'), adminMeal.addMeal);
    app.put("/api/v1/admin/meal/:id", auth, admin, upload.single('image'), adminMeal.updateMeal);
    app.delete("/api/v1/admin/meal/:id", auth, admin, adminMeal.deleteMeal);
    app.put("/api/v1/admin/meal/:id/toggle", auth, admin, adminMeal.toggleAvailability);
}
