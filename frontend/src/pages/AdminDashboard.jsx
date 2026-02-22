import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { orderService, productService, userService } from "../services/api";
import { toast } from "react-toastify";
import { Modal, Form, Button } from "react-bootstrap";
import UserManagement from "../pages/UserManagement";
// import ProductManagement from "./ProductManagement";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState("dashboard");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="d-flex align-items-center mb-4">
          <i className="fas fa-gem text-warning fs-3 me-2"></i>
          <span className="fs-5 fw-bold">Admin Panel</span>
        </div>

        <nav className="d-flex flex-column gap-2">
          <Link
            to="/admin"
            className={currentSection === "dashboard" ? "active" : ""}
            onClick={() => setCurrentSection("dashboard")}
          >
            <i className="fas fa-chart-line me-2"></i>Dashboard
          </Link>
          <Link
            to="/admin/products"
            className={currentSection === "products" ? "active" : ""}
            onClick={() => setCurrentSection("products")}
          >
            <i className="fas fa-box me-2"></i>Products
          </Link>
          <Link
            to="/admin/orders"
            className={currentSection === "orders" ? "active" : ""}
            onClick={() => setCurrentSection("orders")}
          >
            <i className="fas fa-shopping-cart me-2"></i>Orders
          </Link>
          <Link
            to="/admin/users"
            className={currentSection === "users" ? "active" : ""}
            onClick={() => setCurrentSection("users")}
          >
            <i className="fas fa-users me-2"></i>Users
          </Link>
          <button
            className="btn btn-link text-danger text-start mt-4"
            onClick={handleLogout}
          >
            <i className="fas fa-sign-out-alt me-2"></i>Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content-with-sidebar">
        <Routes>
          <Route path="/" element={<DashboardStats />} />
          <Route path="/products" element={<ProductManagement />} />
          <Route path="/orders" element={<OrderManagement />} />
          <Route path="/users" element={<UserManagement />} />
        </Routes>
      </div>
    </div>
  );
};

// Dashboard Stats Component
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import ProductManagement from "./ProductManagement";
import { User } from "lucide-react";

const DashboardStats = () => {
  const [stats, setStats] = useState({
    total_products: 0,
    total_orders: 0,
    total_users: 0,
    total_revenue: 0,
    pending_orders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await orderService.getDashboardStats();
      setStats({
        total_products: response.stats?.total_products ?? 0,
        total_orders: response.stats?.total_orders ?? 0,
        total_users: response.stats?.total_users ?? 0,
        total_revenue: response.stats?.total_revenue ?? 0,
        pending_orders: response.stats?.pending_orders ?? 0,
      });
    } catch (error) {
      toast.error("Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  // Chart Data
  const salesData = [
    { month: "Jan", sales: 45000, orders: 12 },
    { month: "Feb", sales: 52000, orders: 15 },
    { month: "Mar", sales: 48000, orders: 13 },
    { month: "Apr", sales: 61000, orders: 18 },
    { month: "May", sales: 55000, orders: 16 },
    { month: "Jun", sales: 67000, orders: 20 },
  ];

  const categoryData = [
    { name: "Home Appliances", value: 30, color: "#3b82f6" },
    { name: "Interior Design", value: 25, color: "#8b5cf6" },
    { name: "Pillars", value: 20, color: "#ec4899" },
    { name: "Temple Statues", value: 15, color: "#f59e0b" },
    { name: "Name Boards", value: 10, color: "#10b981" },
  ];

  const recentActivity = [
    { month: "Week 1", products: 15, users: 8 },
    { month: "Week 2", products: 22, users: 12 },
    { month: "Week 3", products: 18, users: 10 },
    { month: "Week 4", products: 28, users: 15 },
  ];

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "400px" }}
      >
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-4">
        <h1 className="display-6 fw-bold mb-1">Dashboard Overview</h1>
        <p className="text-muted">
          Welcome back! Here's what's happening with your store today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        {/* Total Products */}
        <div className="col-xl-3 col-md-6">
          <div className="card stat-card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="stat-icon bg-primary-subtle">
                  <i className="fas fa-box text-primary"></i>
                </div>
                <span className="badge bg-primary-subtle text-primary">
                  +12%
                </span>
              </div>
              <h3 className="stat-value mb-1">{stats.total_products}</h3>
              <p className="stat-label text-muted mb-0">Total Products</p>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="col-xl-3 col-md-6">
          <div className="card stat-card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="stat-icon bg-success-subtle">
                  <i className="fas fa-shopping-cart text-success"></i>
                </div>
                <span className="badge bg-success-subtle text-success">
                  +8%
                </span>
              </div>
              <h3 className="stat-value mb-1">{stats.total_orders}</h3>
              <p className="stat-label text-muted mb-0">Total Orders</p>
            </div>
          </div>
        </div>

        {/* Total Users */}
        <div className="col-xl-3 col-md-6">
          <div className="card stat-card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="stat-icon bg-info-subtle">
                  <i className="fas fa-users text-info"></i>
                </div>
                <span className="badge bg-info-subtle text-info">+15%</span>
              </div>
              <h3 className="stat-value mb-1">{stats.total_users}</h3>
              <p className="stat-label text-muted mb-0">Total Users</p>
            </div>
          </div>
        </div>

        {/* Revenue */}
        <div className="col-xl-3 col-md-6">
          <div className="card stat-card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="stat-icon bg-warning-subtle">
                  <i className="fas fa-rupee-sign text-warning"></i>
                </div>
                <span className="badge bg-warning-subtle text-warning">
                  +23%
                </span>
              </div>
              <h3 className="stat-value mb-1">
                ₹{stats.total_revenue.toLocaleString("en-IN")}
              </h3>
              <p className="stat-label text-muted mb-0">Total Revenue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Orders Alert */}
      {stats.pending_orders > 0 && (
        <div
          className="alert alert-warning border-0 shadow-sm mb-4"
          role="alert"
        >
          <div className="d-flex align-items-center">
            <i className="fas fa-exclamation-triangle fs-4 me-3"></i>
            <div>
              <strong>Attention Required!</strong>
              <p className="mb-0">
                {stats.pending_orders} pending orders need your attention
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Charts Row 1 */}
      <div className="row g-4 mb-4">
        {/* Sales Trend Chart */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h5 className="card-title mb-1 fw-bold">Sales Overview</h5>
                  <p className="text-muted small mb-0">
                    Monthly sales and order trends
                  </p>
                </div>
                <div className="btn-group btn-group-sm">
                  <button className="btn btn-outline-secondary active">
                    6M
                  </button>
                  <button className="btn btn-outline-secondary">1Y</button>
                  <button className="btn btn-outline-secondary">All</button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#colorSales)"
                    name="Sales (₹)"
                  />
                  <Area
                    type="monotone"
                    dataKey="orders"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="none"
                    name="Orders"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title mb-3 fw-bold">Product Categories</h5>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-3">
                {categoryData.map((item, index) => (
                  <div
                    key={index}
                    className="d-flex justify-content-between align-items-center mb-2"
                  >
                    <div className="d-flex align-items-center">
                      <div
                        className="me-2"
                        style={{
                          width: "12px",
                          height: "12px",
                          borderRadius: "50%",
                          backgroundColor: item.color,
                        }}
                      ></div>
                      <span className="small">{item.name}</span>
                    </div>
                    <span className="badge bg-light text-dark">
                      {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="row g-4">
        {/* Recent Activity */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title mb-4 fw-bold">Recent Activity</h5>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={recentActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="products"
                    fill="#8b5cf6"
                    radius={[8, 8, 0, 0]}
                    name="Products Added"
                  />
                  <Bar
                    dataKey="users"
                    fill="#ec4899"
                    radius={[8, 8, 0, 0]}
                    name="New Users"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title mb-4 fw-bold">Quick Stats</h5>
              <div className="quick-stats">
                <div className="stat-row">
                  <div className="d-flex justify-content-between align-items-center mb-3 p-3 bg-light rounded">
                    <div>
                      <p className="mb-1 small text-muted">
                        Average Order Value
                      </p>
                      <h4 className="mb-0 fw-bold">₹12,500</h4>
                    </div>
                    <i className="fas fa-chart-line fa-2x text-primary"></i>
                  </div>
                </div>
                <div className="stat-row">
                  <div className="d-flex justify-content-between align-items-center mb-3 p-3 bg-light rounded">
                    <div>
                      <p className="mb-1 small text-muted">Conversion Rate</p>
                      <h4 className="mb-0 fw-bold">3.2%</h4>
                    </div>
                    <i className="fas fa-percentage fa-2x text-success"></i>
                  </div>
                </div>
                <div className="stat-row">
                  <div className="d-flex justify-content-between align-items-center mb-3 p-3 bg-light rounded">
                    <div>
                      <p className="mb-1 small text-muted">Total Views</p>
                      <h4 className="mb-0 fw-bold">28,540</h4>
                    </div>
                    <i className="fas fa-eye fa-2x text-info"></i>
                  </div>
                </div>
                <div className="stat-row">
                  <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                    <div>
                      <p className="mb-1 small text-muted">
                        Customer Satisfaction
                      </p>
                      <h4 className="mb-0 fw-bold">4.8/5.0</h4>
                    </div>
                    <i className="fas fa-star fa-2x text-warning"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Product Management Component
// const ProductManagement = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [editingProduct, setEditingProduct] = useState(null);

//   useEffect(() => {
//     loadProducts();
//   }, []);

//   const loadProducts = async () => {
//     try {
//       setLoading(true);
//       const response = await productService.getAll();
//       setProducts(response.products || []);
//     } catch (error) {
//       toast.error("Failed to load products");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this product?")) {
//       try {
//         await productService.delete(id);
//         toast.success("Product deleted successfully");
//         loadProducts();
//       } catch (error) {
//         toast.error("Failed to delete product");
//       }
//     }
//   };

//   const handleEdit = (product) => {
//     setEditingProduct(product);
//     setShowAddModal(true);
//   };

//   return (
//     <div>
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h1 className="display-6 fw-bold">Products Management</h1>
//         <button
//           className="btn btn-amber"
//           onClick={() => {
//             setEditingProduct(null);
//             setShowAddModal(true);
//           }}
//         >
//           <i className="fas fa-plus me-2"></i>Add New Product
//         </button>
//       </div>

//       {loading ? (
//         <div className="text-center py-5">
//           <div className="loading-spinner"></div>
//         </div>
//       ) : (
//         <div className="card border-0 shadow-sm">
//           <div className="table-responsive">
//             <table className="table table-hover mb-0">
//               <thead className="bg-light">
//                 <tr>
//                   <th>Image</th>
//                   <th>Name</th>
//                   <th>Category</th>
//                   <th>Price</th>
//                   <th>Stock</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {products.map((product) => (
//                   <tr key={product.id}>
//                     <td>
//                       <img
//                         src={product.image}
//                         alt={product.name}
//                         style={{
//                           width: "50px",
//                           height: "50px",
//                           objectFit: "cover",
//                         }}
//                         className="rounded"
//                       />
//                     </td>
//                     <td className="fw-semibold">{product.name}</td>
//                     <td>
//                       <span className="badge bg-secondary">
//                         {product.category}
//                       </span>
//                     </td>
//                     <td>
//                       ₹{Number(product.price || 0).toLocaleString("en-IN")}
//                     </td>
//                     <td>{product.stock}</td>
//                     <td>
//                       <button
//                         className="btn btn-sm btn-primary me-2"
//                         onClick={() => handleEdit(product)}
//                       >
//                         <i className="fas fa-edit"></i>
//                       </button>
//                       <button
//                         className="btn btn-sm btn-danger"
//                         onClick={() => handleDelete(product.id)}
//                       >
//                         <i className="fas fa-trash"></i>
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       <AddProductModal
//         show={showAddModal}
//         onHide={() => {
//           setShowAddModal(false);
//           setEditingProduct(null);
//         }}
//         onSuccess={loadProducts}
//         editingProduct={editingProduct}
//       />
//     </div>
//   );
// };
<ProductManagement />;

// <AddProductModal
//       show={showAddModal}
//       onHide={() => {
//         setShowAddModal(false);
//         setEditingProduct(null);
//       }}
//       onSuccess={loadProducts}
//       editingProduct={editingProduct}
//     />

// Add/Edit Product Modal
export const AddProductModal = ({
  show,
  onHide,
  onSuccess,
  editingProduct,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    originalPrice: "",
    price: "",
    stock: "",
    images: [{ url: "", file: null, preview: "" }],
    description: "",
    specs: "",
  });

  const [loading, setLoading] = useState(false);

  // 🔹 Load editing product
  useEffect(() => {
    if (editingProduct) {
      const existingImages = [
        editingProduct.image1,
        editingProduct.image2,
        editingProduct.image3,
        editingProduct.image4,
      ]
        .filter(Boolean)
        .map((img) => ({
          url: img,
          file: null,
          preview: img,
        }));

      setFormData({
        id: editingProduct.id,
        name: editingProduct.name || "",
        category: editingProduct.category || "",
        originalPrice: editingProduct.originalPrice || "",
        price: editingProduct.price || "",
        stock: editingProduct.stock || "",
        images: existingImages.length
          ? existingImages
          : [{ url: "", file: null, preview: "" }],
        description: editingProduct.description || "",
        specs: editingProduct.specs || "",
      });
    } else {
      setFormData({
        name: "",
        category: "",
        originalPrice: "",
        price: "",
        stock: "",
        images: [{ url: "", file: null, preview: "" }],
        description: "",
        specs: "",
      });
    }
  }, [editingProduct]);

  // 🔹 Normal field change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Handle URL input
  const handleImageUrlChange = (index, value) => {
    const updated = [...formData.images];
    updated[index] = {
      ...updated[index],
      url: value,
      file: null,
      preview: value,
    };
    setFormData({ ...formData, images: updated });
  };

  // 🔹 Handle file upload
  const handleImageUpload = (index, file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const updated = [...formData.images];
      updated[index] = {
        url: "",
        file: file,
        preview: reader.result,
      };
      setFormData({ ...formData, images: updated });
    };
    reader.readAsDataURL(file);
  };

  // 🔹 Add image field
  const addImageField = () => {
    if (formData.images.length >= 4) {
      toast.error("Maximum 4 images allowed");
      return;
    }
    setFormData({
      ...formData,
      images: [...formData.images, { url: "", file: null, preview: "" }],
    });
  };

  // 🔹 Remove image field
  const removeImageField = (index) => {
    const updated = formData.images.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      images: updated.length ? updated : [{ url: "", file: null, preview: "" }],
    });
  };

  // 🔹 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const preparedImages = formData.images
        .map((img) => (img.url ? img.url : img.preview))
        .filter(Boolean); // remove empty

      const finalData = {
        name: formData.name,
        category: formData.category,
        originalPrice: Number(formData.originalPrice),
        price: Number(formData.price),
        stock: Number(formData.stock),
        description: formData.description,
        specs: formData.specs,
        images: preparedImages, // ✅ SEND ARRAY
      };

      if (editingProduct) {
        await productService.update(editingProduct.id, finalData);
        toast.success("Product updated successfully");
      } else {
        await productService.create(finalData);
        toast.success("Product added successfully");
      }

      onSuccess();
      onHide();
    } catch (error) {
      toast.error("Failed to save product");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {editingProduct ? "Edit Product" : "Add New Product"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {/* BASIC INFO */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                <option value="home">Home Appliances</option>
                <option value="interior">Interior Designs</option>
                <option value="pillars">Pillars & Columns</option>
                <option value="temple">Temple Statues</option>
                <option value="nameboard">Name Boards</option>
                <option value="custom">Custom Carvings</option>
              </Form.Select>
            </div>
          </div>

          {/* PRICE */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <Form.Label>Original Price (₹)</Form.Label>
              <Form.Control
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <Form.Label>Price (₹)</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <Form.Group className="mb-3">
            <Form.Label>Stock Quantity</Form.Label>
            <Form.Control
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* IMAGES */}
          <Form.Group className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <Form.Label className="m-0">Product Images (Max 4)</Form.Label>

              <Button
                type="button"
                variant="outline-primary"
                size="sm"
                onClick={addImageField}
              >
                + Add Image
              </Button>
            </div>

            {formData.images.map((imgObj, index) => (
              <div key={index} className="border p-3 rounded mb-3">
                <div className="d-flex gap-2 mb-2">
                  <Form.Control
                    type="url"
                    placeholder={`Paste Image URL ${index + 1}`}
                    value={imgObj.url}
                    onChange={(e) =>
                      handleImageUrlChange(index, e.target.value)
                    }
                  />

                  <span className="align-self-center text-muted">OR</span>

                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageUpload(index, e.target.files[0])
                    }
                  />

                  {formData.images.length > 1 && (
                    <Button
                      type="button"
                      variant="outline-danger"
                      onClick={() => removeImageField(index)}
                    >
                      ✕
                    </Button>
                  )}
                </div>

                {imgObj.preview && (
                  <img
                    src={imgObj.preview}
                    alt="Preview"
                    style={{
                      width: 120,
                      height: 120,
                      objectFit: "cover",
                      borderRadius: 10,
                    }}
                  />
                )}
              </div>
            ))}
          </Form.Group>

          {/* DESCRIPTION */}
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* SPECS */}
          <Form.Group className="mb-3">
            <Form.Label>Specifications</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="specs"
              value={formData.specs}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <div className="d-flex gap-2">
            <Button
              type="submit"
              className="btn-amber flex-grow-1"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : editingProduct
                  ? "Update Product"
                  : "Add Product"}
            </Button>

            <Button variant="secondary" onClick={onHide}>
              Cancel
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

// Order Management Component
const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrders();
      setOrders(response.orders || []);
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateStatus(orderId, newStatus);
      toast.success("Order status updated");
      loadOrders();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-warning",
      processing: "bg-info",
      completed: "bg-success",
      cancelled: "bg-danger",
    };
    return badges[status] || "bg-secondary";
  };

  return (
    <div>
      <h1 className="display-6 fw-bold mb-4">Orders Management</h1>

      {loading ? (
        <div className="text-center py-5">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <div className="card border-0 shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="fw-semibold">#{order.id}</td>
                    <td>
                      <div>{order.customer_name}</div>
                      <small className="text-muted">
                        {order.customer_email}
                      </small>
                    </td>
                    <td>{order.items?.length || 0} items</td>
                    <td className="fw-semibold">
                      ₹{Number(order.total_amount || 0).toLocaleString("en-IN")}
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadge(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                    <td>
                      <select
                        className="form-select form-select-sm"
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// User Management Component
// const UserManagement = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadUsers();
//   }, []);

//   const loadUsers = async () => {
//     try {
//       setLoading(true);
//       const response = await userService.getAll();
//       setUsers(response.users || []);
//     } catch (error) {
//       toast.error("Failed to load users");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this user?")) {
//       try {
//         await userService.delete(id);
//         toast.success("User deleted successfully");
//         loadUsers();
//       } catch (error) {
//         toast.error("Failed to delete user");
//       }
//     }
//   };

//   return (
//     <div>
//       <h1 className="display-6 fw-bold mb-4">Users Management</h1>

//       {loading ? (
//         <div className="text-center py-5">
//           <div className="loading-spinner"></div>
//         </div>
//       ) : (
//         <div className="card border-0 shadow-sm">
//           <div className="table-responsive">
//             <table className="table table-hover mb-0">
//               <thead className="bg-light">
//                 <tr>
//                   <th>ID</th>
//                   <th>Name</th>
//                   <th>Email</th>
//                   <th>Phone</th>
//                   <th>Role</th>
//                   <th>Joined</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {users.map((user) => (
//                   <tr key={user.id}>
//                     <td>{user.id}</td>
//                     <td className="fw-semibold">{user.name}</td>
//                     <td>{user.email}</td>
//                     <td>{user.phone}</td>
//                     <td>
//                       <span
//                         className={`badge ${user.role === "admin" ? "bg-danger" : "bg-primary"}`}
//                       >
//                         {user.role}
//                       </span>
//                     </td>
//                     <td>{new Date(user.created_at).toLocaleDateString()}</td>
//                     <td>
//                       {user.role !== "admin" && (
//                         <button
//                           className="btn btn-sm btn-danger"
//                           onClick={() => handleDelete(user.id)}
//                         >
//                           <i className="fas fa-trash"></i>
//                         </button>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
<UserManagement />;
export default AdminDashboard;
