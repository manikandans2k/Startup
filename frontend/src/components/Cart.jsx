import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function Cart({ onClose }) {
  const { cart, placeOrder } = useContext(CartContext);

  const total = cart.reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="modal show d-block" style={{ background: "rgba(0,0,0,.6)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content p-4">

          <h5 className="fw-bold mb-3">Your Cart</h5>

          {cart.map((item, i) => (
            <div key={i} className="d-flex justify-content-between border-bottom py-2">
              <span>{item.name}</span>
              <span>₹{item.price}</span>
            </div>
          ))}

          <div className="d-flex justify-content-between fw-bold mt-3">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <div className="mt-4 text-end">
            <button className="btn btn-secondary me-2" onClick={onClose}>
              Close
            </button>

            <button className="btn btn-success" onClick={placeOrder}>
              Place Order via WhatsApp
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
