const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { NotFoundError } = require("../errors/customErrors");
const { validateProduct } = require("../middleware");

const router = express.Router();

let productsRef;

const setProducts = (productsData) => {
  productsRef = productsData;
};

router.get("/", (req, res) => {
  try {
    const {
      category,
      inStock,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
    } = req.query;
    let filteredProducts = [...productsRef];

    if (category) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (inStock !== undefined) {
      const stockFilter = inStock === "true";
      filteredProducts = filteredProducts.filter(
        (product) => product.inStock === stockFilter
      );
    }

    if (minPrice) {
      filteredProducts = filteredProducts.filter(
        (product) => product.price >= Number(minPrice)
      );
    }

    if (maxPrice) {
      filteredProducts = filteredProducts.filter(
        (product) => product.price <= Number(maxPrice)
      );
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, parseInt(limit));
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;

    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredProducts.length / limitNum);

    res.json({
      success: true,
      data: paginatedProducts,
      pagination: {
        currentPage: pageNum,
        totalPages: totalPages,
        itemsPerPage: limitNum,
        totalItems: filteredProducts.length,
        hasNextPage: endIndex < filteredProducts.length,
        hasPrevPage: startIndex > 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching products",
    });
  }
});

router.get("/search", (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query (q) is required",
      });
    }

    const searchResults = productsRef.filter(
      (product) =>
        product.name.toLowerCase().includes(q.toLowerCase()) ||
        product.description.toLowerCase().includes(q.toLowerCase())
    );

    res.json({
      success: true,
      data: searchResults,
      count: searchResults.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error searching products",
    });
  }
});

router.get("/stats", (req, res) => {
  try {
    const categoryCount = productsRef.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {});

    const inStockCount = productsRef.filter((p) => p.inStock).length;
    const prices = productsRef.map((p) => p.price);
    const totalValue = prices.reduce((sum, price) => sum + price, 0);
    const averagePrice = totalValue / productsRef.length;

    res.json({
      success: true,
      data: {
        totalProducts: productsRef.length,
        inStock: inStockCount,
        outOfStock: productsRef.length - inStockCount,
        averagePrice: Math.round(averagePrice),
        categories: categoryCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error calculating statistics",
    });
  }
});

router.get("/:id", (req, res) => {
  try {
    const productId = req.params.id;
    const product = productsRef.find((p) => p.id === productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching product",
    });
  }
});

router.post("/", validateProduct, (req, res) => {
  try {
    const { name, description, price, category, inStock } = req.body;

    const newProduct = {
      id: uuidv4(),
      name,
      description,
      price: Number(price),
      category,
      inStock: Boolean(inStock),
    };

    productsRef.push(newProduct);

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding product",
    });
  }
});

router.put("/:id", validateProduct, (req, res) => {
  try {
    const productId = req.params.id;
    const { name, description, price, category, inStock } = req.body;
    const productIndex = productsRef.findIndex((p) => p.id === productId);

    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const updatedProduct = {
      ...productsRef[productIndex],
      ...(name && { name }),
      ...(description && { description }),
      ...(price && { price: Number(price) }),
      ...(category && { category }),
      ...(inStock !== undefined && { inStock: Boolean(inStock) }),
    };

    productsRef[productIndex] = updatedProduct;

    res.json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating product",
    });
  }
});

router.delete("/:id", (req, res) => {
  try {
    const productId = req.params.id;
    const productIndex = productsRef.findIndex((p) => p.id === productId);

    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const deletedProduct = productsRef.splice(productIndex, 1)[0];

    res.json({
      success: true,
      message: "Product deleted successfully",
      data: deletedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting product",
    });
  }
});

module.exports = { router, setProducts };
