import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  Shield,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import { toast } from "react-toastify";
import { getErrorMessage } from "../utils/errorHandler";
import "../CustomeCss/LoginModal.css";

const LoginModal = ({ show, onHide, onShowRegister }) => {
  const [loginType, setLoginType] = useState("user");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return "Email is required";
    }
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  // Password validation
  const validatePassword = (password) => {
    if (!password) {
      return "Password is required";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }
    return "";
  };

  // Validate all fields
  const validateForm = () => {
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    const newErrors = {
      email: emailError,
      password: passwordError,
    };

    setErrors(newErrors);
    return !emailError && !passwordError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling

    // Mark all fields as touched
    setTouched({ email: true, password: true });

    // Validate form first
    if (!validateForm()) {
      toast.error("Please fix the errors in the form", {
        position: "top-right",
        autoClose: 5000, // 5 seconds - longer duration
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return; // STOP - form stays open
    }

    setLoading(true);

    try {
      const response = await login({ ...formData, loginType });

      // Show success message
      toast.success("Login successful! Welcome back.", {
        position: "top-right",
        autoClose: 3000, // 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Reset form state
      setFormData({ email: "", password: "" });
      setErrors({});
      setTouched({});
      setShowPassword(false);

      // Close modal ONLY on successful login
      setTimeout(() => {
        onHide();
      }, 500);

      // Navigate after modal closes
      setTimeout(() => {
        if (response?.user?.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }, 600);
    } catch (error) {
      console.error("Login error:", error);

      const errorMessage = getErrorMessage(error);

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 6000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        closeButton: true,
      });

      setErrors({
        email: "Please check your credentials",
        password: "Please check your credentials",
      });

      setTouched({ email: true, password: true });
    } finally {
      setLoading(false);
      // Modal stays open - NO onHide() call
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error for this field when user starts typing
    if (touched[name]) {
      const error =
        name === "email" ? validateEmail(value) : validatePassword(value);
      setErrors({ ...errors, [name]: error });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });

    // Validate on blur
    const error =
      name === "email" ? validateEmail(value) : validatePassword(value);
    setErrors({ ...errors, [name]: error });
  };

  const handleTabChange = (type) => {
    setLoginType(type);
    // Clear errors when switching tabs
    setErrors({});
    setTouched({});
  };

  const handleModalHide = () => {
    // Reset everything when modal is manually closed
    setFormData({ email: "", password: "" });
    setErrors({});
    setTouched({});
    setShowPassword(false);
    setLoginType("user");
    onHide();
  };

  return (
    <Modal
      show={show}
      onHide={handleModalHide}
      centered
      className="login-modal"
      backdrop="static" // Prevents closing when clicking outside
      keyboard={false} // Prevents closing with ESC key
      enforceFocus={true}
    >
      <div className="login-container">
        <button className="close-btn" onClick={handleModalHide} type="button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="login-header">
          {/* <div className="logo-circle">
            <div className="logo-icon">
              {loginType === "user" ? <User size={32} /> : <Shield size={32} />}
            </div>
          </div> */}
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">Sign in to continue your journey</p>
        </div>

        <div className="login-tabs">
          <button
            type="button"
            className={`tab-btn ${loginType === "user" ? "active" : ""}`}
            onClick={() => handleTabChange("user")}
            disabled={loading}
          >
            <User size={18} />
            <span>User Login</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${loginType === "admin" ? "active" : ""}`}
            onClick={() => handleTabChange("admin")}
            disabled={loading}
          >
            <Shield size={18} />
            <span>Admin Login</span>
          </button>
          <div
            className={`tab-indicator ${loginType === "admin" ? "right" : ""}`}
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className="login-form"
          noValidate
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        >
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={20} />
              <input
                type="email"
                id="email"
                name="email"
                className={`form-input ${errors.email && touched.email ? "error" : ""} ${
                  formData.email && !errors.email && touched.email
                    ? "success"
                    : ""
                }`}
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={loading}
                autoComplete="email"
              />
            </div>
            {errors.email && touched.email && (
              <span className="field-error">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className={`form-input ${errors.password && touched.password ? "error" : ""} ${
                  formData.password && !errors.password && touched.password
                    ? "success"
                    : ""
                }`}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={loading}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
                disabled={loading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && touched.password && (
              <span className="field-error">{errors.password}</span>
            )}
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={20} className="arrow-icon" />
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p className="register-text">
            Don't have an account?{" "}
            <button
              type="button"
              className="register-link"
              onClick={onShowRegister}
              disabled={loading}
            >
              Create one
            </button>
          </p>
        </div>

        <div className="decorative-blob blob-1" />
        <div className="decorative-blob blob-2" />
      </div>
    </Modal>
  );
};

export default LoginModal;
