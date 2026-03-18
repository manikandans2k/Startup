import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useNavigate, useLocation } from "react-router-dom";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import CartModal from "./CartModal";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

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

  //  FIXED NAVIGATION FUNCTION
  const handleNavClick = (sectionId) => {
    if (location.pathname === "/") {
      // Already on home → scroll
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Navigate to home with section
      navigate(`/#${sectionId}`);
    }
  };

  return (
    <>
      <nav
        className={`navbar navbar-expand-lg navbar-light bg-white sticky-top ${
          scrolled ? "navbar-scrolled" : ""
        }`}
      >
        <div className="container">
          {/* Logo */}
          <button
            className="navbar-brand d-flex align-items-center logo-wrapper border-0 bg-transparent"
            onClick={() => navigate("/")}
          >
            <div className="logo-icon-wrapper">
              <i className="fas fa-gem text-warning fs-3"></i>
            </div>
            <span className="logo-text fw-bold fs-4 ms-2">Stone Creations</span>
          </button>

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
                  onClick={() => handleNavClick("home")}
                >
                  <i className="fas fa-home me-1"></i> Home
                </button>
              </li>

              <li className="nav-item">
                <button
                  className="nav-link-custom"
                  onClick={() => handleNavClick("products")}
                >
                  <i className="fas fa-box me-1"></i> Products
                </button>
              </li>

              <li className="nav-item">
                <button
                  className="nav-link-custom"
                  onClick={() => handleNavClick("gallery")}
                >
                  <i className="fas fa-images me-1"></i> Gallery
                </button>
              </li>

              <li className="nav-item">
                <button
                  className="nav-link-custom"
                  onClick={() => handleNavClick("contact")}
                >
                  <i className="fas fa-phone-alt me-1"></i> Contact
                </button>
              </li>

              {/* Cart */}
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

              {/* Auth */}
              {!user ? (
                <li className="nav-item ms-2">
                  <button
                    className="btn-login"
                    onClick={() => setShowLogin(true)}
                  >
                    <i className="fas fa-user me-2"></i> Login
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
                          <button
                            className="dropdown-item"
                            onClick={() => navigate("/admin")}
                          >
                            <i className="fas fa-tachometer-alt me-2 text-primary"></i>
                            Admin Dashboard
                          </button>
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
