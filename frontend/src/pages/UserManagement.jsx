import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  Trash2,
  Search,
  Users,
  Shield,
  Mail,
  Phone,
  Calendar,
  Filter,
  Download,
} from "lucide-react";
import { userService } from "../services/api";
import AdminDashboard from "./AdminDashboard";
import "../CustomeCss/UserManagement.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAll();
      setUsers(response.users || []);
    } catch (error) {
      toast.error("Failed to load users", {
        position: "top-right",
        autoClose: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, userName) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
      try {
        await userService.delete(id);
        toast.success("User deleted successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        loadUsers();
      } catch (error) {
        toast.error("Failed to delete user", {
          position: "top-right",
          autoClose: 4000,
        });
      }
    }
  };

  // Filter users based on search and role
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.includes(searchTerm);

    const matchesRole = filterRole === "all" || user.role === filterRole;

    return matchesSearch && matchesRole;
  });

  const handleExport = () => {
    toast.info("Export feature coming soon!", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  return (
    <div className="user-management">
      {/* Header Section */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-left">
            <div className="icon-wrapper">
              <Users size={32} />
            </div>
            <div>
              <h1 className="page-title">Users Management</h1>
              <p className="page-subtitle">
                Manage and monitor all registered users
              </p>
            </div>
          </div>
          <div className="header-right">
            <div className="stats-card">
              <div className="stat-icon user">
                <Users size={20} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Total Users</span>
                <span className="stat-value">{users.length}</span>
              </div>
            </div>
            <div className="stats-card">
              <div className="stat-icon admin">
                <Shield size={20} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Admins</span>
                <span className="stat-value">
                  {users.filter((u) => u.role === "admin").length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search Section */}
      <div className="filters-section">
        <div className="search-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <Filter size={18} />
          <select
            className="filter-select"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="user">Users Only</option>
            <option value="admin">Admins Only</option>
          </select>
        </div>

        <button className="export-btn" onClick={handleExport}>
          <Download size={18} />
          <span>Export</span>
        </button>
      </div>

      {/* Table Section */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">Loading users...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="empty-state">
          <Users size={64} className="empty-icon" />
          <h3>No Users Found</h3>
          <p>
            {searchTerm || filterRole !== "all"
              ? "Try adjusting your search or filters"
              : "No users registered yet"}
          </p>
        </div>
      ) : (
        <div className="table-card">
          <div className="table-responsive">
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>
                    <div className="th-content">
                      <Users size={16} />
                      <span>Name</span>
                    </div>
                  </th>
                  <th>
                    <div className="th-content">
                      <Mail size={16} />
                      <span>Email</span>
                    </div>
                  </th>
                  <th>
                    <div className="th-content">
                      <Phone size={16} />
                      <span>Phone</span>
                    </div>
                  </th>
                  <th>
                    <div className="th-content">
                      <Shield size={16} />
                      <span>Role</span>
                    </div>
                  </th>
                  <th>
                    <div className="th-content">
                      <Calendar size={16} />
                      <span>Joined</span>
                    </div>
                  </th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user.id} className="user-row">
                    <td>
                      <span className="user-id">#{user.id}</span>
                    </td>
                    <td>
                      <div className="user-info">
                        <div className="user-avatar">
                          {user.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <span className="user-name">{user.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="user-email">{user.email}</span>
                    </td>
                    <td>
                      <span className="user-phone">{user.phone}</span>
                    </td>
                    <td>
                      <span className={`role-badge ${user.role}`}>
                        {user.role === "admin" ? (
                          <>
                            <Shield size={14} />
                            <span>Admin</span>
                          </>
                        ) : (
                          <>
                            <Users size={14} />
                            <span>User</span>
                          </>
                        )}
                      </span>
                    </td>
                    <td>
                      <span className="join-date">
                        {new Date(user.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </td>
                    <td>
                      <div className="actions-cell">
                        {user.role !== "admin" ? (
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(user.id, user.name)}
                            title="Delete user"
                          >
                            <Trash2 size={18} />
                          </button>
                        ) : (
                          <span className="protected-label">Protected</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="table-footer">
            <p className="results-count">
              Showing <strong>{filteredUsers.length}</strong> of{" "}
              <strong>{users.length}</strong> users
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
