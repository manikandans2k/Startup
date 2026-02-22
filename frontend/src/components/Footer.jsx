export default function Footer() {
  return (
    <footer className="bg-dark text-white py-5">
      <div className="container">
        <div className="row g-4">
          {/* Company Info */}
          <div className="col-md-3">
            <div className="d-flex align-items-center mb-3">
              <i className="fas fa-gem text-warning fs-2 me-2"></i>
              <span className="fs-4 fw-bold">Stone Creations</span>
            </div>
            <p className="footer-text">
              Crafting timeless stone masterpieces for over 20 years.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-3">
            <h5 className="fw-bold mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#home" className="footer-link text-decoration-none">
                  Home
                </a>
              </li>
              <li className="mb-2">
                <a href="#products" className="footer-link text-decoration-none">
                  Products
                </a>
              </li>
              <li className="mb-2">
                <a href="#gallery" className="footer-link text-decoration-none">
                  Gallery
                </a>
              </li>
              <li className="mb-2">
                <a href="#contact" className="footer-link text-decoration-none">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="col-md-3">
            <h5 className="fw-bold mb-3">Categories</h5>
            <ul className="list-unstyled">
              <li className="footer-text mb-2">Home Appliances</li>
              <li className="footer-text mb-2">Interior Designs</li>
              <li className="footer-text mb-2">Pillars & Columns</li>
              <li className="footer-text mb-2">Temple Statues</li>
            </ul>
          </div>

          {/* Follow Us */}
          <div className="col-md-3">
            <h5 className="fw-bold mb-3">Follow Us</h5>
            <div className="d-flex gap-3 fs-4 mb-3">
              <a href="#" className="footer-social" aria-label="Facebook">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="footer-social" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="footer-social" aria-label="YouTube">
                <i className="fab fa-youtube"></i>
              </a>
              <a 
                href="https://wa.me/919876543210" 
                className="footer-social footer-whatsapp"
                aria-label="WhatsApp"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-whatsapp"></i>
              </a>
            </div>
            <span className="badge bg-warning text-dark px-3 py-2">
              💳 Online Payment Coming Soon
            </span>
          </div>
        </div>

        <hr className="my-4 border-secondary" />
        <p className="text-center footer-text mb-0">
          © 2026 Stone Creations. All rights reserved.
        </p>
      </div>
    </footer>
  );
}