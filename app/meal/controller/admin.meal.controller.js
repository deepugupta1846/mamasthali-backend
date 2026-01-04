const db = require("../../model");
const Meal = db.meal;

/**
 * GET ALL MEALS (Admin - includes unavailable)
 */
exports.getAllMeals = async (req, res) => {
  try {
    const meals = await Meal.findAll({
      order: [["created_at", "DESC"]],
    });

    res.json({
      success: true,
      data: meals,
    });
  } catch (error) {
    console.error("Get All Meals Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * ADD MEAL
 */
exports.addMeal = async (req, res) => {
  try {
    const { name, meal_type, price, description, image_url } = req.body;

    if (!name || !meal_type || !price) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const meal = await Meal.create({
      name,
      meal_type,
      price,
      description,
      image_url,
    });

    res.status(201).json({
      success: true,
      message: "Meal added successfully",
      data: meal,
    });
  } catch (error) {
    console.error("Add Meal Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


exports.updateMeal = async (req, res) => {
  try {
    const meal = await Meal.findByPk(req.params.id);
    if (!meal) {
      return res.status(404).json({ success: false, message: "Meal not found" });
    }

    await meal.update(req.body);

    res.json({
      success: true,
      message: "Meal updated successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};


exports.deleteMeal = async (req, res) => {
  try {
    const meal = await Meal.findByPk(req.params.id);
    if (!meal) {
      return res.status(404).json({ success: false, message: "Meal not found" });
    }

    await meal.destroy();

    res.json({
      success: true,
      message: "Meal deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};


exports.toggleAvailability = async (req, res) => {
  try {
    const meal = await Meal.findByPk(req.params.id);
    if (!meal) {
      return res.status(404).json({ success: false, message: "Meal not found" });
    }

    meal.is_available = !meal.is_available;
    await meal.save();

    res.json({
      success: true,
      message: `Meal ${meal.is_available ? "available" : "unavailable"}`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};



