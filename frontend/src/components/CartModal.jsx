import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useCart } from "../context/CartContext";
import { orderService, whatsappService } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const CartModal = ({ show, onHide }) => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const { user } = useAuth();

  const handleCheckout = async () => {
    try {
      await orderService.createOrder();

      const message = whatsappService.generateOrderMessage(
        user,
        cartItems,
        getCartTotal(),
      );

      whatsappService.openWhatsApp(message);
      onHide();
      toast.success("Order placed! Check WhatsApp");
    } catch (error) {
      console.error("Checkout failed:", error);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Shopping Cart</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {cartItems.length === 0 ? (
          <div className="text-center py-5">
            <i className="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
            <p className="text-muted">Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="cart-items mb-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="d-flex align-items-center bg-light p-3 rounded mb-3"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                    }}
                    className="rounded me-3"
                  />
                  <div className="flex-grow-1">
                    <h6 className="mb-1">{item.name}</h6>
                    <p className="text-muted mb-0">
                      ₹{item.price.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="d-flex align-items-center gap-2 me-3">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="px-2">{item.quantity}</span>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              ))}
            </div>

            <div className="border-top pt-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="fs-5 fw-bold">Total:</span>
                <span className="fs-4 fw-bold text-warning">
                  ₹{getCartTotal().toLocaleString("en-IN")}
                </span>
              </div>
              <Button
                variant="success"
                className="w-100"
                size="lg"
                onClick={handleCheckout}
              >
                <i className="fab fa-whatsapp me-2"></i>
                Checkout via WhatsApp
              </Button>
            </div>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default CartModal;
