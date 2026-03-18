import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import { productService, whatsappService } from "../services/api";
import { toast } from "react-toastify";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const galleryImages = [
    {
      url: "https://images.unsplash.com/photo-1600607686527-6fb886090705?w=500&q=80",
      title: "Stone Engraving",
    },
    {
      url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&q=80",
      title: "Marble Sculptures",
    },
    {
      url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=500&q=80",
      title: "Stone Pillars",
    },
    {
      url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500&q=80",
      title: "Temple Carvings",
    },
    {
      url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&q=80",
      title: "Marble Sculptures",
    },
    {
      url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=500&q=80",
      title: "Custom Work",
    },
    {
      url: "https://images.unsplash.com/photo-1600607686527-6fb886090705?w=500&q=80",
      title: "Stone Engraving",
    },
    {
      url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=500&q=80",
      title: "Stone Pillars",
    },
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

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

  const handleCategoryClick = (cat) => {
    setCategory(cat);
    document.getElementById("products").scrollIntoView({ behavior: "smooth" });
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  return (
    <>
      <Navbar />
      <Hero />
      <Categories onCategoryClick={handleCategoryClick} />

      {/* Products Section - Show Only 8 Products */}
      <section id="products" className="py-5 stone-texture">
        <div className="container">
          <h2 className="text-center display-5 fw-bold mb-2">
            Our Premium Products
          </h2>
          <p className="text-center text-muted mb-5">
            Handcrafted stone masterpieces for your space
          </p>

          {/* Products Grid - Limited to 8 */}
          {loading ? (
            <div className="text-center py-5">
              <div className="loading-spinner"></div>
            </div>
          ) : (
            <>
              <div className="gallery-grid">
                {products.slice(0, 8).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={() => handleProductClick(product)}
                  />
                ))}
              </div>

              {/* See All Products Button */}
              {products.length > 8 && (
                <div className="text-center mt-5">
                  <button
                    className="btn-see-all"
                    onClick={() => navigate("/products")}
                  >
                    <span>See All Products</span>
                    <i className="fas fa-arrow-right ms-2"></i>
                    <span className="product-count">
                      {products.length} Products
                    </span>
                  </button>
                </div>
              )}
            </>
          )}

          {products.length === 0 && !loading && (
            <div className="text-center py-5">
              <i className="fas fa-box-open fa-3x text-muted mb-3"></i>
              <p className="text-muted">No products available</p>
            </div>
          )}
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-5 bg-white">
        <div className="container">
          <h2 className="text-center display-5 fw-bold mb-2">
            Our Work Gallery
          </h2>
          <p className="text-center text-muted mb-5">
            Explore our completed projects
          </p>

          <div className="gallery-grid">
            {galleryImages.map((image, index) => (
              <div key={index} className="gallery-item">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-100"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/500/8B7355/FFFFFF?text=Gallery+${index + 1}`;
                  }}
                />
                <div className="gallery-overlay">
                  <h5>{image.title}</h5>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center display-5 fw-bold mb-5">Get In Touch</h2>

          <div className="row g-4">
            <div className="col-md-6">
              <div className="card border-0 shadow-sm mb-3">
                <div className="card-body d-flex align-items-start">
                  <i className="fas fa-phone-alt text-warning fs-2 me-3"></i>
                  <div>
                    <h5 className="fw-bold">Phone</h5>
                    <p className="mb-1 text-muted">+91 90251 53037</p>
                    <a href="tel:+919025153037" className="text-warning">
                      Call Now
                    </a>
                  </div>
                </div>
              </div>

              <div className="card border-0 shadow-sm mb-3">
                <div className="card-body d-flex align-items-start">
                  <i className="fab fa-whatsapp text-success fs-2 me-3"></i>
                  <div>
                    <h5 className="fw-bold">WhatsApp</h5>
                    <p className="mb-1 text-muted">+91 90251 53037</p>
                    <button
                      className="btn btn-link text-success p-0"
                      onClick={() =>
                        whatsappService.openWhatsApp(
                          "Hello! I would like to know more about your products.",
                        )
                      }
                    >
                      Chat on WhatsApp
                    </button>
                  </div>
                </div>
              </div>

              <div className="card border-0 shadow-sm mb-3">
                <div className="card-body d-flex align-items-start">
                  <i className="fas fa-envelope text-primary fs-2 me-3"></i>
                  <div>
                    <h5 className="fw-bold">Email</h5>
                    <p className="mb-1 text-muted">info@stonecreations.com</p>
                    <a
                      href="mailto:info@stonecreations.com"
                      className="text-primary"
                    >
                      Send Email
                    </a>
                  </div>
                </div>
              </div>

              <div className="card border-0 shadow-sm">
                <div className="card-body d-flex align-items-start">
                  <i className="fas fa-map-marker-alt text-danger fs-2 me-3"></i>
                  <div>
                    <h5 className="fw-bold">Location</h5>
                    <p className="mb-0 text-muted">
                      123 Stone Street, Marble City
                      <br />
                      Karnataka, India - 560001
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h4 className="fw-bold mb-4">Send us a Message</h4>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.target);
                      const message = whatsappService.generateContactMessage(
                        formData.get("name"),
                        formData.get("phone"),
                        formData.get("interest"),
                        formData.get("message"),
                      );
                      whatsappService.openWhatsApp(message);
                    }}
                  >
                    <div className="mb-3">
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="Your Name"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="tel"
                        name="phone"
                        className="form-control"
                        placeholder="Phone Number"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <select name="interest" className="form-select" required>
                        <option value="">Select Product Interest</option>
                        <option>Home Stone Appliances</option>
                        <option>Stone Interior Designs</option>
                        <option>Pillars & Columns</option>
                        <option>Temple & God Statues</option>
                        <option>Name Boards</option>
                        <option>Custom Carvings</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <textarea
                        name="message"
                        className="form-control"
                        rows="4"
                        placeholder="Your Message"
                        required
                      ></textarea>
                    </div>
                    <button type="submit" className="btn btn-success w-100">
                      <i className="fab fa-whatsapp me-2"></i>Send via WhatsApp
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* WhatsApp Float */}

      {/* <a
        href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || "919025153037"}`}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
      >
        <i className="fab fa-whatsapp"></i>
      </a> */}

      <ProductModal
        show={showProductModal}
        onHide={() => setShowProductModal(false)}
        product={selectedProduct}
      />
    </>
  );
};

export default HomePage;
