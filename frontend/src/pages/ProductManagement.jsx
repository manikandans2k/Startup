import React, { useEffect, useState } from "react";
import { productService } from "../services/api";
import { toast } from "react-toastify";
import { AddProductModal } from "./AdminDashboard";
import ViewProductModal from "./ViewProductModal";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);

  const totalPages = Math.ceil(total / pageSize);

  useEffect(() => {
    loadProducts();
  }, [page, pageSize]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await productService.getAll({
        page,
        limit: pageSize,
      });
      setProducts(res.products || []);
      setTotal(res.totalCount || 0);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await productService.delete(id);
      toast.success("Product deleted");
      loadProducts();
    } catch {
      toast.error("Delete failed");
    }
  };

  /* =========================
     Helpers
  ========================== */

  const badgeColor = (category) =>
    ({
      home: "primary",
      interior: "secondary",
      pillars: "dark",
      temple: "danger",
      nameboard: "info",
      custom: "warning",
    })[category] || "secondary";

  const stockBadge = (stock) =>
    stock > 10 ? "success" : stock > 0 ? "warning" : "danger";

  /* =========================
     Render
  ========================== */

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="fw-bold mb-0">Products Management</h2>
          <small className="text-muted">Manage your product inventory</small>
        </div>

        {/* Add Button */}
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingProduct(null);
            setShowAddModal(true);
          }}
        >
          Add New Product
        </button>
      </div>
      {/* Controls */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="d-flex align-items-center gap-2">
          <span>Page Size:</span>
          <select
            className="form-select form-select-sm w-auto"
            value={pageSize}
            onChange={(e) => {
              setPage(1);
              setPageSize(Number(e.target.value));
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        <small className="text-muted">
          {total > 0 &&
            `${(page - 1) * pageSize + 1}–${Math.min(
              page * pageSize,
              total,
            )} of ${total}`}
        </small>
      </div>
      {/* Table */}
      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: 70 }}>ID</th>
                <th>Image</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Original Price</th>
                <th>Price</th>
                <th>Stock</th>
                <th style={{ width: 120 }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-5">
                    Loading...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5">
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((p, i) => (
                  <tr key={p.id}>
                    <td className="fw-semibold">
                      {(page - 1) * pageSize + i + 1}
                    </td>

                    <td>
                      <img
                        src={p.image1}
                        alt=""
                        width="50"
                        height="50"
                        style={{
                          objectFit: "cover",
                          borderRadius: 8,
                          border: "1px solid #e5e7eb",
                        }}
                      />
                    </td>

                    <td className="fw-semibold">{p.name}</td>

                    <td>
                      <span className={`badge bg-${badgeColor(p.category)}`}>
                        {p.category}
                      </span>
                    </td>

                    <td className="fw-semibold text-success">
                      ₹{Number(p.originalPrice).toLocaleString("en-IN")}
                    </td>

                    <td className="fw-semibold text-success">
                      ₹{Number(p.price).toLocaleString("en-IN")}
                    </td>

                    <td>
                      <span className={`badge bg-${stockBadge(p.stock)}`}>
                        {p.stock} units
                      </span>
                    </td>

                    <td>
                      <div className="d-flex gap-2">
                        {/* VIEW BUTTON */}
                        <button
                          className="btn btn-sm btn-info text-white"
                          onClick={() => {
                            setViewProduct(p);
                            setShowViewModal(true);
                          }}
                        >
                          <i className="fas fa-eye"></i>
                        </button>

                        {/* EDIT */}
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => {
                            setEditingProduct(p);
                            setShowAddModal(true);
                          }}
                        >
                          <i className="fas fa-edit"></i>
                        </button>

                        {/* DELETE  */}
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(p.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Pagination */}
      <div className="d-flex justify-content-end mt-3 gap-2">
        <button
          className="btn btn-outline-secondary btn-sm"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>

        <span className="align-self-center small">
          Page {page} of {totalPages || 1}
        </span>

        <button
          className="btn btn-outline-secondary btn-sm"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
      {/* Modal */}
      <AddProductModal
        show={showAddModal}
        editingProduct={editingProduct}
        onHide={() => {
          setShowAddModal(false);
          setEditingProduct(null);
        }}
        onSuccess={loadProducts}
      />
      <ViewProductModal
        show={showViewModal}
        product={viewProduct}
        onHide={() => {
          setShowViewModal(false);
          setViewProduct(null);
        }}
      />
      ;
    </div>
  );
};

export default ProductManagement;
