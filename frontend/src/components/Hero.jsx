import React, { useEffect, useState } from "react";
import "../CustomeCss/Hero.css";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToProducts = () => {
    document.getElementById("products").scrollIntoView({ behavior: "smooth" });
  };

  const openWhatsApp = () => {
    const number = import.meta.env.VITE_WHATSAPP_NUMBER || "919025153037";
    window.open(`https://wa.me/${number}`, "_blank");
  };

  return (
    <section id="home" className="hero-section">
      {/* Animated Background */}
      <div className="hero-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
        <div className="mesh-gradient"></div>
      </div>

      {/* Animated Particles */}
      <div className="particles-container">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="container h-100">
        <div className="row h-100 align-items-center justify-content-center">
          <div className="col-lg-10 col-xl-9">
            <div className="hero-content-wrapper">
              {/* Premium Badge */}
              <div className={`premium-badge ${isVisible ? "animate-in" : ""}`}>
                <span className="badge-shimmer"></span>
                <i className="fas fa-gem"></i>
                <span>Premium Stone Craftsmanship</span>
              </div>

              {/* Main Heading */}
              <h1
                className={`hero-main-title ${isVisible ? "animate-in" : ""}`}
              >
                Crafting <span className="text-gradient">Timeless</span>
                <br />
                <span className="text-outline">Stone Creations</span>
              </h1>

              {/* Decorative Line */}
              <div
                className={`decorative-line ${isVisible ? "animate-in" : ""}`}
              >
                <span className="line-dot"></span>
                <span className="line-bar"></span>
                <span className="line-dot"></span>
              </div>

              {/* Subtitle */}
              <p
                className={`hero-description ${isVisible ? "animate-in" : ""}`}
              >
                Exquisite stone work for homes, temples & gardens
                <br />
                <span className="description-accent">
                  Handcrafted with passion, delivered with precision
                </span>
              </p>

              {/* Quick Features */}
              <div
                className={`quick-features ${isVisible ? "animate-in" : ""}`}
              >
                <div className="feature-item">
                  <div className="feature-icon">
                    <i className="fas fa-award"></i>
                  </div>
                  <span>Premium Quality</span>
                </div>
                <div className="feature-divider"></div>
                <div className="feature-item">
                  <div className="feature-icon">
                    <i className="fas fa-palette"></i>
                  </div>
                  <span>Custom Design</span>
                </div>
                <div className="feature-divider"></div>
                <div className="feature-item">
                  <div className="feature-icon">
                    <i className="fas fa-truck-fast"></i>
                  </div>
                  <span>Fast Delivery</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className={`hero-actions ${isVisible ? "animate-in" : ""}`}>
                <button
                  className="cta-btn primary-cta"
                  onClick={scrollToProducts}
                >
                  <span className="btn-bg"></span>
                  <span className="btn-content">
                    <i className="fas fa-shopping-bag"></i>
                    <span>Explore Collection</span>
                  </span>
                  <span className="btn-glow"></span>
                </button>

                <button className="cta-btn whatsapp-cta" onClick={openWhatsApp}>
                  <span className="btn-bg"></span>
                  <span className="btn-content">
                    <i className="fab fa-whatsapp"></i>
                    <span>Order on WhatsApp</span>
                  </span>
                  <span className="btn-glow"></span>
                </button>
              </div>

              {/* Stats */}
              <div className={`hero-stats ${isVisible ? "animate-in" : ""}`}>
                <div className="stat-item">
                  <div className="stat-value">500+</div>
                  <div className="stat-label">Happy Clients</div>
                </div>
                <div className="stat-separator"></div>
                <div className="stat-item">
                  <div className="stat-value">1000+</div>
                  <div className="stat-label">Projects Done</div>
                </div>
                <div className="stat-separator"></div>
                <div className="stat-item">
                  <div className="stat-value">25+</div>
                  <div className="stat-label">Years Legacy</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="scroll-down">
        <div className="scroll-mouse">
          <span className="scroll-wheel"></span>
        </div>
        <span className="scroll-label">Discover More</span>
      </div>
    </section>
  );
};

export default Hero;
