// Task 4: Custom error classes
class CustomAPIError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

class NotFoundError extends CustomAPIError {
  constructor(resource = "Resource") {
    super(`${resource} not found`);
    this.statusCode = 404;
  }
}

class ValidationError extends CustomAPIError {
  constructor(errors = []) {
    super("Validation failed");
    this.statusCode = 400;
    this.errors = errors;
  }
}

class UnauthorizedError extends CustomAPIError {
  constructor(message = "Authentication required") {
    super(message);
    this.statusCode = 401;
  }
}

module.exports = {
  CustomAPIError,
  NotFoundError,
  ValidationError,
  UnauthorizedError,
};