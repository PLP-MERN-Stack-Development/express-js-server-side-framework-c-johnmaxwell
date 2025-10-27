// Task 4: Global error handling middleware
const { CustomAPIError } = require("../errors/customErrors");

const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message);

  let errorResponse = {
    success: false,
    message: err.message || "Something went wrong on the server",
  };

  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode || 500).json({
      ...errorResponse,
      ...(err.errors && { errors: err.errors }),
    });
  }

  res.status(500).json(errorResponse);
};

module.exports = errorHandler;
