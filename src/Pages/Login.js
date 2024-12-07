import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./../Components/Navbar";

import "./Login.css";
import BACKEND_URL from "./Components/config";

const Login = ({ setToken }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${BACKEND_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        console.error("Server Error:", data);
        throw new Error(data.message || "Failed to process request");
      }

      const token = data.token; // Storing the JWT token
      const role = data.role;
      sessionStorage.setItem("token", token);
      setToken(token);

      // Handle successful login
      setSuccessMessage("Login successful!");
      setError("");

      // Only fetch profile if login is successful
      const profileResponse = await fetch(`${BACKEND_URL}/user/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the header
        },
      });
      const profileData = await profileResponse.json();
      if (profileResponse.ok) {
        // Navigate based on user role
        if (role === "admin") {
          navigate("/admin", { state: { token } }); // Navigate to admin page
        } else {
          navigate("/"); // Navigate to Homepage
        }
      } else {
        console.error("Error fetching profile:", profileData);
        alert("Failed to fetch profile data.");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div>
            <input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
          <button type="submit">Login</button>
        </form>
      </div>
    </>
  );
};

export default Login;
