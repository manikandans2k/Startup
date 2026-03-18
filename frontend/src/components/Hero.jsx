import React, { useEffect, useState } from "react";
import "../CustomeCss/Hero.css";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  // Images (add your real images here)
  const images = [
    "/images/ganesha-stone.png",
    "/images/murugan.png",
    "/images/garden-chair.png"
  ];

  useEffect(() => {
    setIsVisible(true);

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
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
      <div className="container h-100">
<div className="row align-items-center h-100 flex-column-reverse flex-lg-row">
          {/* LEFT CONTENT */}
          <div className="col-lg-6">
            <div className={`hero-content ${isVisible ? "animate-in" : ""}`}>

              <div className="premium-badge">
                <i className="fas fa-gem"></i>
                <span>Premium Stone Craftsmanship</span>
              </div>

              <h1 className="hero-title">
                Premium <span>Stone Art</span>
                <br />
                For Every Space
              </h1>

              <p className="hero-description">
                From sacred temple idols & Ganesha carvings to modern stone sofas,
                garden sculptures & custom interiors — crafted in granite & marble.
              </p>

              <div className="hero-actions">
                <button className="cta-btn primary" onClick={scrollToProducts}>
                  Explore Collection
                </button>

                <button className="cta-btn whatsapp" onClick={openWhatsApp}>
                  Order on WhatsApp
                </button>
              </div>

              <div className="hero-stats">
                <div>
                  <h3>500+</h3>
                  <span>Clients</span>
                </div>
                <div>
                  <h3>1000+</h3>
                  <span>Projects</span>
                </div>
                <div>
                  <h3>25+</h3>
                  <span>Years</span>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT IMAGE LOOP */}
          <div className="col-lg-6 text-center">
            <div className="hero-image-wrapper">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt="Stone Art"
                  className={`hero-image ${
                    index === currentImage ? "active" : ""
                  }`}
                />
              ))}
            </div>

            {/* Dots */}
            <div className="dots">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={i === currentImage ? "dot active" : "dot"}
                  onClick={() => setCurrentImage(i)}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;