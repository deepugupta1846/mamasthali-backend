const db = require("../../model");
const Meal = db.meal;

exports.getMenu = async (req, res) => {
  try {
    const meals = await Meal.findAll({
      where: { is_available: true },
      order: [["meal_type", "ASC"]],
    });

    res.json({
      success: true,
      data: meals,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};


exports.getMealById = async (req, res) => {
  const meal = await Meal.findByPk(req.params.id);
  if (!meal) {
    return res.status(404).json({ success: false, message: "Meal not found" });
  }

  res.json({ success: true, data: meal });
};

/**
 * Get meals by category
 */
exports.getMealsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const limit = parseInt(req.query.limit) || 10;

    const meals = await Meal.findAll({
      where: { 
        meal_type: category,
        is_available: true 
      },
      order: [["created_at", "DESC"]],
      limit: limit,
    });

    res.json({
      success: true,
      data: meals,
    });
  } catch (error) {
    console.error("Get Meals By Category Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};