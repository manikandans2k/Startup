import { useEffect, useState } from "react";
import api from "../services/api";
import EditProductModal from "./EditProductModal";

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);

  const load = () => api.get("/products").then(res => setProducts(res.data));
  useEffect(load, []);

  const remove = async (id) => {
    await api.delete(`/products/${id}`);
    load();
  };

  return (
    <>
      <table className="table">
        <thead>
          <tr><th>Name</th><th>Original Price</th><th>Price</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>₹{p.originalPrice}</td>
              <td>₹{p.price}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2"
                  onClick={() => setEditProduct(p)}>Edit</button>

                <button className="btn btn-sm btn-danger"
                  onClick={() => remove(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editProduct && (
        <EditProductModal
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onUpdated={load}
        />
      )}
    </>
  );
}
