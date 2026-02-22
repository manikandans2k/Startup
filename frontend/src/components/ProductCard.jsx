import React from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { whatsappService } from "../services/api";
import "../CustomeCss/ProductCard.css";

const ProductCard = ({ product, onClick }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    await addToCart(product.id, 1);
  };

  const handleOrder = (e) => {
    e.stopPropagation();
    const message = whatsappService.generateProductMessage(product);
    whatsappService.openWhatsApp(message);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    whatsappService.shareProduct(product);
  };

  // Calculate discount percentage
  const calculateDiscount = () => {
    if (!product.originalPrice || product.originalPrice <= product.price)
      return 0;
    return Math.round(
      ((product.originalPrice - product.price) / product.originalPrice) * 100,
    );
  };

  const discountPercent = calculateDiscount();

  // Get the primary image
  const getProductImage = () => {
    return product.image1 || product.image2 || product.image3 || product.image4 || 'https://via.placeholder.com/300x300?text=No+Image';
  };

  // Get stock status
  const getStockStatus = () => {
    if (product.stock === 0) return { class: 'out-stock', text: 'Out of Stock' };
    if (product.stock < 10) return { class: 'low-stock', text: 'Low Stock' };
    return { class: 'in-stock', text: 'In Stock' };
  };

  const stockStatus = getStockStatus();

  return (
    <div className="product-card-wrapper" onClick={onClick}>
      <div className="product-card card h-100">
        {/* Image Container with Overlay */}
        <div className="position-relative overflow-hidden product-image-container">
          <img
            src={getProductImage()}
            alt={product.name}
            className="card-img-top w-100 h-100 product-image"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x300?text=Image+Not+Found';
            }}
          />

          {/* Gradient Overlay */}
          <div className="image-overlay"></div>

          {/* Discount Badge */}
          {discountPercent > 0 && (
            <div className="discount-badge">
              <span className="discount-percent">{discountPercent}%</span>
              <span className="discount-text">OFF</span>
            </div>
          )}

          {/* Stock Badge */}
          {product.stock < 10 && product.stock > 0 && (
            <span className="stock-badge stock-low">
              <i className="fas fa-fire me-1"></i>
              Only {product.stock} left
            </span>
          )}

          {product.stock === 0 && (
            <span className="stock-badge stock-out">Out of Stock</span>
          )}

          {/* Quick View Icon */}
          <div className="quick-view-icon">
            <i className="fas fa-eye"></i>
          </div>
        </div>

        {/* Card Body */}
        <div className="card-body p-3 d-flex flex-column">
          {/* Title with decorative line */}
          <div className="title-section mb-2">
            <h6 className="card-title fw-bold mb-0">{product.name}</h6>
            <div className="title-underline"></div>
          </div>

          {/* Description - 5 Lines */}
          <p className="card-text text-muted mb-3 description-text">
            {product.description}
          </p>

          {/* Price Section - NEW PROFESSIONAL DESIGN */}
          <div className="price-section mb-3 mt-auto">
            <div className="price-container">
              <div className="price-wrapper">
                {/* Original Price */}
                {product.originalPrice && product.originalPrice > product.price && (
                  <div className="original-price">
                    <span className="price-label">MRP:</span>
                    <span className="price-value">
                      ₹{product.originalPrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

                {/* Offer Price */}
                <div className="offer-price">
                  <span className="price-currency">₹</span>
                  <span className="price-amount">
                    {product.price.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* Savings */}
                {product.originalPrice && product.originalPrice > product.price && (
                  <div className="savings-text">
                    You save ₹{(product.originalPrice - product.price).toLocaleString("en-IN")}
                  </div>
                )}
              </div>

              {/* Stock Info */}
              <div className="stock-info">
                <div className="stock-info-left">
                  <i className="fas fa-box-open"></i>
                  <span className="stock-count">{product.stock}</span>
                  <span>available</span>
                </div>
                <span className={`stock-status ${stockStatus.class}`}>
                  {stockStatus.text}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons d-flex gap-2">
            {user && user.role === "user" ? (
              <button
                className="btn-primary-action flex-grow-1"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <i className="fas fa-cart-plus me-2"></i>
                <span>Add to Cart</span>
              </button>
            ) : (
              <button
                className="btn-whatsapp-action flex-grow-1"
                onClick={handleOrder}
              >
                <i className="fab fa-whatsapp me-2"></i>
                <span>Order Now</span>
              </button>
            )}
            <button className="btn-share-action" onClick={handleShare}>
              <i className="fas fa-share-alt"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;