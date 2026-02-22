import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import { productService } from "../services/api";
import { toast } from "react-toastify";
import Footer from "../components/Footer";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, category, sortBy]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAll();
      setProducts(response.products || []);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    if (category !== "all") {
      filtered = filtered.filter((p) => p.category === category);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "newest") {
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    setFilteredProducts(filtered);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  return (
    <>
      <Navbar />

      {/* Page Header */}
      {/* Page Header - Pure Bootstrap */}
      {/* Compact Page Header */}
      {/* <section className="bg-primary text-white py-4">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h2 mb-1 fw-bold">All Products</h1>
              <p className="mb-0 small">
                Browse our complete collection of handcrafted stone masterpieces
              </p>
            </div>
            <button
              className="btn btn-light btn-sm rounded-pill"
              onClick={() => navigate("/")}
            >
              <i className="fas fa-arrow-left me-2"></i>Back to Home
            </button>
          </div>
        </div>
      </section> */}

      {/* Products Section */}
      <section className="py-5 stone-texture">
        <div className="container">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded shadow-sm mb-4">
            <div className="row g-3 align-items-center">
              <div className="col-md-3">
                <label className="form-label fw-semibold mb-2">
                  <i className="fas fa-filter me-2"></i>Category
                </label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="home">Home Appliances</option>
                  <option value="interior">Interior Designs</option>
                  <option value="pillars">Pillars & Columns</option>
                  <option value="temple">Temple Statues</option>
                  <option value="nameboard">Name Boards</option>
                  <option value="custom">Custom Carvings</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label fw-semibold mb-2">
                  <i className="fas fa-sort me-2"></i>Sort By
                </label>
                <select
                  className="form-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="popular">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold mb-2">
                  <i className="fas fa-search me-2"></i>Search
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-3">
            <p className="text-muted">
              Showing <strong>{filteredProducts.length}</strong> products
              {category !== "all" && (
                <span>
                  {" "}
                  in <strong>{category}</strong> category
                </span>
              )}
            </p>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="text-center py-5">
              <div className="loading-spinner"></div>
              <p className="text-muted mt-3">Loading products...</p>
            </div>
          ) : (
            <div className="gallery-grid">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => handleProductClick(product)}
                />
              ))}
            </div>
          )}

          {filteredProducts.length === 0 && !loading && (
            <div className="text-center py-5">
              <i className="fas fa-box-open fa-3x text-muted mb-3"></i>
              <h4 className="text-muted">No products found</h4>
              <p className="text-muted">
                Try adjusting your filters or search term
              </p>
              <button
                className="btn btn-amber mt-3"
                onClick={() => {
                  setCategory("all");
                  setSearchTerm("");
                  setSortBy("popular");
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />
      <ProductModal
        show={showProductModal}
        onHide={() => setShowProductModal(false)}
        product={selectedProduct}
      />
    </>
  );
};

export default ProductsPage;
