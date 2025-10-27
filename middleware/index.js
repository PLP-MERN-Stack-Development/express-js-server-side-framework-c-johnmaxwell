// Task 3 & 4: Middleware exports
module.exports = {
  requestLogger: require("./logger"),
  authenticateApiKey: require("./auth"),
  validateProduct: require("./validation"),
  errorHandler: require("./errorHandler"),
};
