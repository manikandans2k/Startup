import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import CartModal from "./CartModal";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <nav className={`navbar navbar-expand-lg navbar-light bg-white sticky-top ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="container">
          {/* Logo with animation */}
          <a className="navbar-brand d-flex align-items-center logo-wrapper" href="/">
            <div className="logo-icon-wrapper">
              <i className="fas fa-gem text-warning fs-3"></i>
            </div>
            <span className="logo-text fw-bold fs-4 ms-2">Stone Creations</span>
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center gap-2">
              {/* Navigation Links */}
              <li className="nav-item">
                <button
                  className="nav-link-custom"
                  onClick={() => scrollToSection("home")}
                >
                  <i className="fas fa-home me-1"></i>
                  <span>Home</span>
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link-custom"
                  onClick={() => scrollToSection("products")}
                >
                  <i className="fas fa-box me-1"></i>
                  <span>Products</span>
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link-custom"
                  onClick={() => scrollToSection("gallery")}
                >
                  <i className="fas fa-images me-1"></i>
                  <span>Gallery</span>
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link-custom"
                  onClick={() => scrollToSection("contact")}
                >
                  <i className="fas fa-phone-alt me-1"></i>
                  <span>Contact</span>
                </button>
              </li>

              {/* Cart Icon (User only) */}
              {user && user.role === "user" && (
                <li className="nav-item ms-2">
                  <button
                    className="cart-button position-relative"
                    onClick={() => setShowCart(true)}
                  >
                    <i className="fas fa-shopping-cart"></i>
                    {getCartCount() > 0 && (
                      <span className="cart-badge animate-bounce">
                        {getCartCount()}
                      </span>
                    )}
                  </button>
                </li>
              )}

              {/* Auth Section */}
              {!user ? (
                <li className="nav-item ms-2">
                  <button
                    className="btn-login"
                    onClick={() => setShowLogin(true)}
                  >
                    <i className="fas fa-user me-2"></i>
                    <span>Login</span>
                  </button>
                </li>
              ) : (
                <li className="nav-item dropdown ms-2">
                  <button
                    className="btn-user-menu dropdown-toggle"
                    data-bs-toggle="dropdown"
                  >
                    <div className="user-avatar">
                      <i className="fas fa-user"></i>
                    </div>
                    <span className="user-name">{user.name}</span>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end user-dropdown">
                    {isAdmin() && (
                      <>
                        <li>
                          <a className="dropdown-item" href="/admin">
                            <i className="fas fa-tachometer-alt me-2 text-primary"></i>
                            Admin Dashboard
                          </a>
                        </li>
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                      </>
                    )}
                    <li>
                      <button
                        className="dropdown-item logout-item"
                        onClick={handleLogout}
                      >
                        <i className="fas fa-sign-out-alt me-2"></i>
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Modals */}
      <LoginModal
        show={showLogin}
        onHide={() => setShowLogin(false)}
        onShowRegister={() => {
          setShowLogin(false);
          setShowRegister(true);
        }}
      />
      <RegisterModal
        show={showRegister}
        onHide={() => setShowRegister(false)}
        onShowLogin={() => {
          setShowRegister(false);
          setShowLogin(true);
        }}
      />
      <CartModal show={showCart} onHide={() => setShowCart(false)} />
    </>
  );
};

export default Navbar;