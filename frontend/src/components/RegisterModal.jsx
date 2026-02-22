import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  MapPin,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { toast } from "react-toastify";
import "../CustomeCss/RegisterModal.css";
import { getErrorMessage } from "../utils/errorHandler";

const RegisterModal = ({ show, onHide, onShowLogin }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const { register } = useAuth();

  // Validation functions
  const validateName = (name) => {
    if (!name) return "Full name is required";
    if (name.length < 3) return "Name must be at least 3 characters";
    if (!/^[a-zA-Z\s]+$/.test(name)) return "Name can only contain letters";
    return "";
  };

  const validateEmail = (email) => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePhone = (phone) => {
    if (!phone) return "Phone number is required";
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone.replace(/[\s-]/g, ""))) {
      return "Please enter a valid 10-digit phone number";
    }
    return "";
  };

  const validateAddress = (address) => {
    if (!address) return "Address is required";
    if (address.length < 10) return "Please enter a complete address";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (!/(?=.*[a-z])/.test(password))
      return "Password must contain a lowercase letter";
    if (!/(?=.*[A-Z])/.test(password))
      return "Password must contain an uppercase letter";
    if (!/(?=.*\d)/.test(password)) return "Password must contain a number";
    return "";
  };

  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) return "Please confirm your password";
    if (confirmPassword !== password) return "Passwords do not match";
    return "";
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      phone: validatePhone(formData.phone),
      address: validateAddress(formData.address),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(
        formData.confirmPassword,
        formData.password,
      ),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      phone: true,
      address: true,
      password: true,
      confirmPassword: true,
    });

    // Validate form
    if (!validateForm()) {
      toast.error("Please fix the errors in the form", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    setLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        password: formData.password,
      });

      toast.success("Registration successful! Welcome aboard!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        password: "",
        confirmPassword: "",
      });
      setErrors({});
      setTouched({});
      setShowPassword(false);
      setShowConfirmPassword(false);

      // Close modal on success
      setTimeout(() => {
        onHide();
      }, 500);
    } catch (error) {
      console.error("Registration failed:", error);

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
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error for this field when user starts typing
    if (touched[name]) {
      let error = "";
      switch (name) {
        case "name":
          error = validateName(value);
          break;
        case "email":
          error = validateEmail(value);
          break;
        case "phone":
          error = validatePhone(value);
          break;
        case "address":
          error = validateAddress(value);
          break;
        case "password":
          error = validatePassword(value);
          // Also revalidate confirm password if it's been touched
          if (touched.confirmPassword) {
            setErrors((prev) => ({
              ...prev,
              confirmPassword: validateConfirmPassword(
                formData.confirmPassword,
                value,
              ),
            }));
          }
          break;
        case "confirmPassword":
          error = validateConfirmPassword(value, formData.password);
          break;
        default:
          break;
      }
      setErrors({ ...errors, [name]: error });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });

    let error = "";
    switch (name) {
      case "name":
        error = validateName(value);
        break;
      case "email":
        error = validateEmail(value);
        break;
      case "phone":
        error = validatePhone(value);
        break;
      case "address":
        error = validateAddress(value);
        break;
      case "password":
        error = validatePassword(value);
        break;
      case "confirmPassword":
        error = validateConfirmPassword(value, formData.password);
        break;
      default:
        break;
    }
    setErrors({ ...errors, [name]: error });
  };

  const handleModalHide = () => {
    // Reset everything when modal is manually closed
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
    setTouched({});
    setShowPassword(false);
    setShowConfirmPassword(false);
    onHide();
  };

  return (
    <Modal
      show={show}
      onHide={handleModalHide}
      centered
      className="register-modal"
      backdrop="static"
      keyboard={false}
      size="lg"
    >
      <div className="register-container">
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

        <div className="register-header">
          {/* <div className="logo-circle">
            <div className="logo-icon">
              <User size={32} />
            </div>
          </div> */}
          <h2 className="register-title">Create Account</h2>
          <p className="register-subtitle">
            Join us and start your journey today
          </p>
        </div>

        <form onSubmit={handleSubmit} className="register-form" noValidate>
          <div className="form-row">
            {/* Full Name */}
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <div className="input-wrapper">
                <User className="input-icon" size={20} />
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={`form-input ${errors.name && touched.name ? "error" : ""} ${
                    formData.name && !errors.name && touched.name
                      ? "success"
                      : ""
                  }`}
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  autoComplete="name"
                />
                {formData.name && !errors.name && touched.name && (
                  <CheckCircle2 className="success-icon" size={20} />
                )}
              </div>
              {errors.name && touched.name && (
                <span className="field-error">{errors.name}</span>
              )}
            </div>

            {/* Email */}
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
                {formData.email && !errors.email && touched.email && (
                  <CheckCircle2 className="success-icon" size={20} />
                )}
              </div>
              {errors.email && touched.email && (
                <span className="field-error">{errors.email}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            {/* Phone Number */}
            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                Phone Number
              </label>
              <div className="input-wrapper">
                <Phone className="input-icon" size={20} />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className={`form-input ${errors.phone && touched.phone ? "error" : ""} ${
                    formData.phone && !errors.phone && touched.phone
                      ? "success"
                      : ""
                  }`}
                  placeholder="1234567890"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  autoComplete="tel"
                  maxLength={10}
                />
                {formData.phone && !errors.phone && touched.phone && (
                  <CheckCircle2 className="success-icon" size={20} />
                )}
              </div>
              {errors.phone && touched.phone && (
                <span className="field-error">{errors.phone}</span>
              )}
            </div>

            {/* Address */}
            <div className="form-group">
              <label htmlFor="address" className="form-label">
                Address
              </label>
              <div className="input-wrapper">
                <MapPin className="input-icon" size={20} />
                <input
                  type="text"
                  id="address"
                  name="address"
                  className={`form-input ${errors.address && touched.address ? "error" : ""} ${
                    formData.address && !errors.address && touched.address
                      ? "success"
                      : ""
                  }`}
                  placeholder="123 Main St, City, State"
                  value={formData.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  autoComplete="street-address"
                />
                {formData.address && !errors.address && touched.address && (
                  <CheckCircle2 className="success-icon" size={20} />
                )}
              </div>
              {errors.address && touched.address && (
                <span className="field-error">{errors.address}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            {/* Password */}
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
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  autoComplete="new-password"
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

            {/* Confirm Password */}
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={20} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  className={`form-input ${errors.confirmPassword && touched.confirmPassword ? "error" : ""} ${
                    formData.confirmPassword &&
                    !errors.confirmPassword &&
                    touched.confirmPassword
                      ? "success"
                      : ""
                  }`}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex="-1"
                  disabled={loading}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && touched.confirmPassword && (
                <span className="field-error">{errors.confirmPassword}</span>
              )}
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight size={20} className="arrow-icon" />
              </>
            )}
          </button>
        </form>

        <div className="register-footer">
          <p className="login-text">
            Already have an account?{" "}
            <button
              type="button"
              className="login-link"
              onClick={onShowLogin}
              disabled={loading}
            >
              Sign In
            </button>
          </p>
        </div>

        <div className="decorative-blob blob-1" />
        <div className="decorative-blob blob-2" />
      </div>
    </Modal>
  );
};

export default RegisterModal;
