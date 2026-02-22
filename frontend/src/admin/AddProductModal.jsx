import { useState } from "react";
import { addProduct } from "../services/productService";
import { toast } from "react-toastify";

export default function AddProductModal({ onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    originalPrice: "",
    price: "",
    stock: "",
    description: "",
    specs: "",
    image: [""],
  });

  const handleSubmit = async () => {
    if (
      !form.name ||
      !form.category ||
      !form.originalPrice ||
      !form.price ||
      !form.stock
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      await addProduct({
        ...form,
        originalPrice: Number(form.originalPrice),
        price: Number(form.price),
        stock: Number(form.stock),
      });

      toast.success("Product added successfully");
      onSuccess();
    } catch (err) {
      toast.error("Failed to add product");
      console.error(err);
    }
  };

  return (
    <div>
      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        placeholder="Category"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      />
      
      <input
        placeholder="Original Price"
        type="number"
        value={form.originalPrice}
        onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
      />

      <input
        placeholder="Price"
        type="number"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: e.target.value })}
      />

      <input
        placeholder="Stock"
        type="number"
        value={form.stock}
        onChange={(e) => setForm({ ...form, stock: e.target.value })}
      />

      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <textarea
        placeholder="Specs"
        value={form.specs}
        onChange={(e) => setForm({ ...form, specs: e.target.value })}
      />

      <input
        placeholder="Image URL"
        value={form.image}
        onChange={(e) => setForm({ ...form, image: e.target.value })}
      />

      <button className="btn btn-primary mt-3" onClick={handleSubmit}>
        Add Product
      </button>
    </div>
  );
}
