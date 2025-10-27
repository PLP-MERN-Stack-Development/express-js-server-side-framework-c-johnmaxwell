const express = require("express");
const { v4: uuidv4 } = require("uuid");
const {
  requestLogger,
  authenticateApiKey,
  errorHandler,
} = require("./middleware");
const { router: productRoutes, setProducts } = require("./routes/products");

const app = express();
const PORT = process.env.PORT || 3000;

let products = [
  {
    id: "1",
    name: "SketchPad",
    description: "Fine quality paper with 50, 140gsm sheets",
    price: 400,
    category: "books",
    inStock: true,
  },
  {
    id: "2",
    name: "Mechanical Pencil",
    description: "Metallic with a case of free 0.5 hb leds",
    price: 800,
    category: "pencils",
    inStock: false,
  },
  {
    id: "3",
    name: "Retractable blade",
    description: "Has blades that can be discarder",
    price: 250,
    category: "tool",
    inStock: true,
  },
  {
    id: "4",
    name: "Charcoal",
    description: "Give the darkest shades of black",
    price: 180,
    category: "pencils",
    inStock: true,
  },
];

setProducts(products);

app.use(express.json());

app.use(requestLogger);

app.use(authenticateApiKey);

app.get("/", (req, res) => {
  res.send(
    "Welcome to my FIRST API... Visit /api/products to see all products."
  );
});

app.use("/api/products", productRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
