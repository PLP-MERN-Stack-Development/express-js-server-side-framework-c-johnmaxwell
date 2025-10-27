const { ValidationError } = require("../errors/customErrors");

const validateProduct = (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;
  const errors = [];

  if (req.method === "POST") {
    if (!name) errors.push("Name is required");
    if (!description) errors.push("Description is required");
    if (!price) errors.push("Price is required");
    if (!category) errors.push("Category is required");
  }

  if (name && typeof name !== "string") errors.push("Name must be a string");
  if (description && typeof description !== "string")
    errors.push("Description must be a string");
  if (price && isNaN(Number(price))) errors.push("Price must be a number");
  if (category && typeof category !== "string")
    errors.push("Category must be a string");

  // Fix: Allow string 'true'/'false' and convert to boolean
  if (inStock !== undefined) {
    if (inStock === "true" || inStock === true) {
      req.body.inStock = true;
    } else if (inStock === "false" || inStock === false) {
      req.body.inStock = false;
    } else if (typeof inStock !== "boolean") {
      errors.push("inStock must be a boolean (true/false)");
    }
  }

  if (price && Number(price) < 0) errors.push("Price cannot be negative");

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors,
    });
  }

  next();
};

module.exports = validateProduct;
