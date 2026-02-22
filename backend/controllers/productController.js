// ========================================
// PRODUCT CONTROLLER
// controllers/productController.js
// ========================================

const { query } = require("../config/db");

/**
 * @desc    Get all products
 * @route   GET /api/products
 * @access  Public
 */
const getAllProducts = async (req, res) => {
  try {
    const { category, search, sortBy, minPrice, maxPrice } = req.query;

    let sql = "SELECT * FROM products WHERE 1=1";
    const params = [];

    if (category && category !== "all") {
      sql += " AND category = ?";
      params.push(category);
    }

    if (search) {
      sql += " AND (name LIKE ? OR description LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    if (minPrice) {
      sql += " AND price >= ?";
      params.push(minPrice);
    }
    if (maxPrice) {
      sql += " AND price <= ?";
      params.push(maxPrice);
    }

    if (sortBy === "price-low") {
      sql += " ORDER BY price ASC";
    } else if (sortBy === "price-high") {
      sql += " ORDER BY price DESC";
    } else if (sortBy === "newest") {
      sql += " ORDER BY created_at DESC";
    } else {
      sql += " ORDER BY id DESC";
    }

    const products = await query(sql, params);

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get Products Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * @desc    Get single product
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const products = await query("SELECT * FROM products WHERE id = ?", [id]);

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      product: products[0],
    });
  } catch (error) {
    console.error("Get Product Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * @desc    Create new product
 * @route   POST /api/products
 * @access  Private/Admin
 */
const createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      originalPrice,
      price,
      stock,
      images, // array of max 4
      description,
      specs,
    } = req.body;

    if (!name || !category || !originalPrice || !price) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, category, original price, and price",
      });
    }

    // validate images
    if (!Array.isArray(images)) {
      return res.status(400).json({
        success: false,
        message: "Images must be an array",
      });
    }

    if (images.length > 4) {
      return res.status(400).json({
        success: false,
        message: "Maximum 4 images allowed",
      });
    }

    const image1 = images[0] || null;
    const image2 = images[1] || null;
    const image3 = images[2] || null;
    const image4 = images[3] || null;

    const result = await query(
      `INSERT INTO products 
      (name, category, originalPrice, price, stock, image1, image2, image3, image4, description, specs)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        category,
        originalPrice,
        price,
        stock || 0,
        image1,
        image2,
        image3,
        image4,
        description,
        specs,
      ],
    );

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      productId: result.insertId,
    });
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * @desc    Update product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, category, originalPrice, price, stock, images, description, specs } =
      req.body;

    if (!name || !category || !originalPrice || !price) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, category, original price, and price",
      });
    }

    const safeImages = Array.isArray(images) ? images : [];

    const image1 = safeImages[0] || null;
    const image2 = safeImages[1] || null;
    const image3 = safeImages[2] || null;
    const image4 = safeImages[3] || null;

    await query(
      `UPDATE products SET 
        name=?, category=?, originalPrice=?, price=?, stock=?, 
        image1=?, image2=?, image3=?, image4=?, 
        description=?, specs=?
      WHERE id=?`,
      [
        name,
        category,
        originalPrice,
        price,
        stock || 0,
        image1,
        image2,
        image3,
        image4,
        description || "",
        specs || "",
        id,
      ],
    );

    res.json({
      success: true,
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * @desc    Delete product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query("DELETE FROM products WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * @desc    Get products by category
 * @route   GET /api/products/category/:category
 * @access  Public
 */
const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const products = await query(
      "SELECT * FROM products WHERE category = ? ORDER BY created_at DESC",
      [category],
    );

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get Products by Category Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
};
