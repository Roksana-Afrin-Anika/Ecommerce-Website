import React, { useEffect, useState } from "react";
import "./Profile.css";

import { useNavigate } from "react-router-dom";
import Navbar from "./../Components/Navbar";
import BACKEND_URL from "../Components/config";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/user/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>No user data available.</div>;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleSave = async () => {
    try {
      const updatedData = {
        name: formData.name || user.name,
        email: formData.email || user.email,
        address: formData.address || user.address,
        ...passwordData,
      };

      const response = await fetch(`${BACKEND_URL}/user/profile/update`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      const data = await response.json();
      setUser(data.user);
      setIsEditing(false);
      alert(data.message);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const Sidebar = ({ onLogout }) => (
    <div className="sidebar">
      <ul>
        {user?.role === "admin" && (
          <li>
            <button onClick={() => navigate("/admin")}>Dashboard</button>
          </li>
        )}
        {user?.role !== "admin" && (
          <li>
            <button onClick={() => navigate("/cart")}>Cart</button>
          </li>
        )}
        <li>
          <button onClick={onLogout}>Logout</button>
        </li>
      </ul>
    </div>
  );

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setIsLoggedIn(false);
    alert("Logged out successfully!");
    navigate("/");
  };

  return (
    <>
      <Navbar />

      {isLoggedIn && <Sidebar onLogout={handleLogout} />}
      <div className="profile">
        <h1>My Profile</h1>
        {!isEditing ? (
          <div className="profile">
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Address:</strong> {user.address}
            </p>
            <p>
              <strong>Role:</strong> {user.role}
            </p>
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          </div>
        ) : (
          <div className="edit-profile">
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Address:
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Current Password:
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
              />
            </label>
            <label>
              New Password:
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
              />
            </label>
            <button className="save-btn" onClick={handleSave}>
              Save
            </button>
            <button className="cancel-btn" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;

