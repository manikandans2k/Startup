import { useState } from "react";
import api from "../services/api";

export default function EditProductModal({ product, onClose, onUpdated }) {
  const [form, setForm] = useState({ ...product });

  const handleUpdate = async () => {
    await api.put(`/products/${product.id}`, form);
    onUpdated();
    onClose();
  };

  return (
    <div className="modal show d-block" style={{ background: "rgba(0,0,0,.6)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content p-4">
          <h5 className="fw-bold mb-3">Edit Product</h5>

          {["name","category","originalPrice","price","image"].map(field => (
            <input key={field}
              className="form-control mb-2"
              placeholder={field}
              value={form[field]}
              onChange={e => setForm({ ...form, [field]: e.target.value })}
            />
          ))}

          <textarea className="form-control mb-2"
            placeholder="Description"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />

          <textarea className="form-control mb-2"
            placeholder="Specs"
            value={form.specs}
            onChange={e => setForm({ ...form, specs: e.target.value })}
          />

          <select className="form-control mb-3"
            value={form.status}
            onChange={e => setForm({ ...form, status: e.target.value })}
          >
            <option value={1}>Active</option>
            <option value={0}>Hidden</option>
          </select>

          <div className="text-end">
            <button className="btn btn-secondary me-2" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleUpdate}>
              Update Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
