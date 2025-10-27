const { UnauthorizedError } = require("../errors/customErrors");

const authenticateApiKey = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  const publicRoutes = [
    { path: "/", method: "GET" },
    { path: "/api/products", method: "GET" },
    { path: "/api/products/search", method: "GET" },
    { path: "/api/products/stats", method: "GET" },
  ];

  const isPublicRoute = publicRoutes.some(
    (route) => req.path === route.path && req.method === route.method
  );

  // Also allow GET /api/products/:id (dynamic routes)
  const isProductById =
    req.path.startsWith("/api/products/") && req.method === "GET";

  if (isPublicRoute || isProductById) {
    return next();
  }

  if (!apiKey) {
    throw new UnauthorizedError(
      "API key is required. Please provide x-api-key in headers."
    );
  }

  const validApiKeys = ["secret-api-key-123", "test-key-456"];
  if (!validApiKeys.includes(apiKey)) {
    throw new UnauthorizedError("Invalid API key");
  }

  next();
};

module.exports = authenticateApiKey;
