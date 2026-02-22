import React, { useMemo } from "react";
import { Modal } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { whatsappService } from "../services/api";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const ProductModal = ({ show, onHide, product }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();

  const images = useMemo(() => {
    if (!product) return [];

    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images.filter(Boolean);
    }

    return [product.image1, product.image2, product.image3, product.image4].filter(Boolean);
  }, [product]);

  // ✅ now safe to return
  if (!product) return null;

  const handleAddToCart = async () => {
    await addToCart(product.id, 1);
  };

  const handleOrder = () => {
    const message = whatsappService.generateProductMessage(product);
    whatsappService.openWhatsApp(message);
  };

  const handleShare = () => {
    whatsappService.shareProduct(product);
  };

  return (
    <Modal show={show} onHide={onHide} centered dialogClassName="product-modal-xl">
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">{product.name}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="row g-4">
          <div className="col-12 col-lg-6">
            <div className="product-image-box rounded-4 overflow-hidden shadow-sm">
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                spaceBetween={10}
                slidesPerView={1}
              >
                {images.map((img, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={img}
                      alt={`${product.name}-${index + 1}`}
                      className="product-modal-img"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <div className="d-flex align-items-center gap-3 mb-3">
              <span className="price-tag fs-5">
                ₹{Number(product.price).toLocaleString("en-IN")}
              </span>
              <span className="text-muted">{product.stock} in stock</span>
            </div>

            <p className="text-muted mb-4">{product.description}</p>

            <div className="bg-light p-3 rounded-4 mb-4">
              <h6 className="fw-bold mb-2">Specifications:</h6>
              <p className="mb-0 small">{product.specs}</p>
            </div>

            <div className="d-flex gap-2">
              {user && user.role === "user" ? (
                <button className="btn btn-amber flex-grow-1" onClick={handleAddToCart}>
                  <i className="fas fa-cart-plus me-2"></i>Add to Cart
                </button>
              ) : (
                <button className="btn btn-success flex-grow-1" onClick={handleOrder}>
                  <i className="fab fa-whatsapp me-2"></i>Order on WhatsApp
                </button>
              )}

              <button className="btn btn-outline-secondary" onClick={handleShare}>
                <i className="fas fa-share-alt me-2"></i>Share
              </button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ProductModal;
