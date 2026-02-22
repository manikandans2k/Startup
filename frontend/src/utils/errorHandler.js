// src/utils/errorHandler.js

export const getErrorMessage = (error) => {
  // Default message
  let message = "Something went wrong. Please try again.";

  // Check for response data message
  if (error.response?.data?.message) {
    message = error.response.data.message;
  }
  // Check for response data error
  else if (error.response?.data?.error) {
    message = error.response.data.error;
  }
  // Check for validation errors array
  else if (error.response?.data?.errors) {
    const errors = error.response.data.errors;
    if (Array.isArray(errors) && errors.length > 0) {
      message = errors[0].msg || errors[0].message || errors[0];
    }
  }
  // Check for error message (but exclude generic network errors)
  else if (error.message && error.message !== "Network Error") {
    message = error.message;
  }
  // Check for response status codes
  else if (error.response?.status) {
    switch (error.response.status) {
      case 400:
        message = "Invalid request. Please check your input.";
        break;
      case 401:
        message = "Invalid credentials. Please try again.";
        break;
      case 403:
        message = "Access denied.";
        break;
      case 404:
        message = "Resource not found.";
        break;
      case 409:
        message = "This email is already registered.";
        break;
      case 500:
        message = "Server error. Please try again later.";
        break;
      default:
        message = "Something went wrong. Please try again.";
    }
  }

  return message;
};
