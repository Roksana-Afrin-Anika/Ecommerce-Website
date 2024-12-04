import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";
import ProductDetail from "./Components/ProductDetail";
import Cart from "./Components/Cart";
import Checkout from "./Components/Checkout";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Admin from "./Components/Admin";
import Profile from "./Components/Profile";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";

function App() {
  const [token, setToken] = useState(null); // Initialize state for token

  useEffect(() => {
    const storedToken = sessionStorage.getItem("token"); // Retrieve token from session storage
    if (storedToken) {
      setToken(storedToken); // Set the token state if it exists
    }
  }, []);
  const ProtectedRoute = ({ children }) => {
    return token ? children : <Navigate to="/" />;
  };

  return (
    <I18nextProvider i18n={i18n}>
      <div>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login setToken={setToken} />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile isAdmin={true} />
                </ProtectedRoute>
              }
            />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin token={token} />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </div>
    </I18nextProvider>
  );
}

export default App;
