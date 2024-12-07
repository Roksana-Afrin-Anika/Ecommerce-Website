import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import Navbar from "./../Components/Navbar";
import BACKEND_URL from "../Components/config";

const Register = ({ setToken }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    address: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form from reloading the page

    // Basic validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.username ||
      !formData.password ||
      !formData.address
    ) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/user/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        console.error("Server Error:", data);
        throw new Error("Failed to process request");
      }

      console.log(`Signup successful:`, data);
      alert("Signup Successfully");

      const token = data.token; // Storing the JWT token
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("isSignedUp", "true"); // Set the signup flag
      setToken(token);
      navigate("/login");

      // Reset form data after successful signup
      setFormData({
        name: "",
        email: "",
        username: "",
        password: "",
        address: "",
      });
    } catch (err) {
      console.error("Error during submission:", err);
      alert("Signup failed. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="register-container">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </>
  );
};

export default Register;
