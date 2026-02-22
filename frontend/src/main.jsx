// ========================================
// REACT ENTRY POINT
// src/main.jsx
// ========================================

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./NewStyles.css";
import App from "./App";

// Import Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Import FontAwesome
import "@fortawesome/fontawesome-free/css/all.min.css";

// Import React Toastify
import "react-toastify/dist/ReactToastify.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
