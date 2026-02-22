import { useEffect, useState } from "react";
import api from "../services/api";

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/orders")
      .then(res => setOrders(res.data))
      .catch(console.error);
  }, []);

  return (
    <div>
      <h4 className="mb-4">WhatsApp Orders</h4>

      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Customer</th>
            <th>Phone</th>
            <th>Order Details</th>
            <th>Total</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((o, i) => (
            <tr key={o.id}>
              <td>{i + 1}</td>
              <td>{o.user_name || "Guest"}</td>
              <td>{o.phone || "-"}</td>
              <td style={{ whiteSpace: "pre-wrap" }}>
                {o.whatsapp_message}
              </td>
              <td>₹{o.total_amount}</td>
              <td>{new Date(o.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {orders.length === 0 && (
        <p className="text-muted text-center">No orders yet</p>
      )}
    </div>
  );
}
