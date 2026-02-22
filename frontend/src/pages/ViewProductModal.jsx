import { Modal } from "react-bootstrap";
import { useState, useEffect } from "react";

const ViewProductModal = ({ show, onHide, product }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (product) {
      const images = [
        product.image1,
        product.image2,
        product.image3,
        product.image4,
      ].filter(Boolean);

      setSelectedImage(images[0]);
    }
  }, [product]);

  if (!product) return null;

  const images = [
    product.image1,
    product.image2,
    product.image3,
    product.image4,
  ].filter(Boolean);

  const nextImage = () => {
    const currentIndex = images.indexOf(selectedImage);
    const nextIndex = (currentIndex + 1) % images.length;
    setSelectedImage(images[nextIndex]);
  };

  const prevImage = () => {
    const currentIndex = images.indexOf(selectedImage);
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setSelectedImage(images[prevIndex]);
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="xl"
      dialogClassName="luxury-modal"
    >
      <Modal.Body className="p-0">
        <div
          className="d-flex"
          style={{
            maxHeight: "85vh", // 👈 NOT increasing modal
          }}
        >
          {/* LEFT IMAGE */}
          <div
            className="position-relative bg-black"
            style={{
              width: "60%",
            }}
          >
            <img
              src={selectedImage}
              alt={product.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />

            <button
              onClick={onHide}
              className="btn btn-light position-absolute top-0 end-0 m-4 rounded-circle shadow"
            >
              ✕
            </button>
          </div>

          {/* RIGHT SIDE */}
          <div
            className="bg-white d-flex flex-column"
            style={{
              width: "40%",
            }}
          >
            {/* SCROLLABLE AREA */}
            <div
              className="p-5"
              style={{
                overflowY: "auto",
                maxHeight: "calc(85vh - 120px)", // 👈 keeps thumbnails visible
              }}
            >
              <p
                className="text-uppercase text-muted mb-2"
                style={{ letterSpacing: "2px", fontSize: 12 }}
              >
                {product.category}
              </p>

              <h1 className="fw-light mb-4">{product.name}</h1>

              <div className="mb-4">
                <span className="text-muted text-decoration-line-through me-3">
                  ₹{Number(product.originalPrice).toLocaleString("en-IN")}
                </span>
                <span className="fw-semibold fs-4">
                  ₹{Number(product.price).toLocaleString("en-IN")}
                </span>
              </div>

              <hr />

              <p className="text-muted">{product.stock} pieces available</p>

              <div
                className="text-muted mt-4"
                style={{
                  whiteSpace: "pre-line",
                  lineHeight: 1.0,
                }}
              >
                {product.description}
              </div>
            </div>

            {/* THUMBNAILS FIXED BOTTOM */}
            <div className="p-4 border-top d-flex gap-3 flex-wrap">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  onClick={() => setSelectedImage(img)}
                  style={{
                    width: 70,
                    height: 70,
                    objectFit: "contain",
                    cursor: "pointer",
                    border:
                      selectedImage === img
                        ? "2px solid black"
                        : "1px solid #ddd",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ViewProductModal;
