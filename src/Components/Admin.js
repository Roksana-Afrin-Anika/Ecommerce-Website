import React, { useState, useEffect } from "react";
import "./Admin.css"; // Assuming you have CSS styles in this file
import { useNavigate } from "react-router-dom";
import Navbar from "./../Components/Navbar";
import BACKEND_URL from "./config";

const Admin = ({ token }) => {
  const [products, setProducts] = useState([]); // Initialize as an empty array
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    imageUrl: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  // Fetch all products from the server
  const fetchProducts = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/product/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Include token for authentication
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      console.log("Fetched products:", data); // Log the response data
      setProducts(data.products || data); // Ensure data.products exists
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
    fetchProducts();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission for adding/updating products
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = isEditing
        ? `${BACKEND_URL}/product/${formData.id}`
        : `${BACKEND_URL}/product/`;
      const method = isEditing ? "PUT" : "POST";
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save product");
      }

      await fetchProducts();
      // Refresh the product list
      resetForm();
    } catch (error) {
      console.error("Error during submission:", error);
    }
  };

  // Handle editing a product
  const handleEdit = (product) => {
    setFormData({
      id: product._id, // Ensure you are using the correct key
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      imageUrl: product.imageUrl,
    });
    setIsEditing(true);
  };

  // Handle product deletion
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${BACKEND_URL}/product/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      await fetchProducts(); // Refresh the product list
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      description: "",
      price: "",
      category: "",
      stock: "",
      imageUrl: "",
    });
    setIsEditing(false);
  };
  // Filter products based on the search query
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const Sidebar = ({ onLogout, navigate }) => (
    <div className="sidebar">
      <ul>
        <li>
          <button onClick={() => navigate("/profile")}>Profile</button>
        </li>
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
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      {isLoggedIn && (
        <Sidebar onLogout={handleLogout} navigate={navigate} isAdmin={true} />
      )}
      <div className="admin-container">
        <h2>Admin Product Management</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="description"
            placeholder="Product Description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock Quantity"
            value={formData.stock}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="imageUrl"
            placeholder="Image URL"
            value={formData.imageUrl}
            onChange={handleChange}
          />
          <button type="submit">
            {isEditing ? "Update Product" : "Add Product"}
          </button>
          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        </form>

        <h3>Product List</h3>
        <ul>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <li key={product._id}>
                <strong>{product.name}</strong>
                <p>{product.description}</p>
                <span>Price: ${product.price}</span>
                <span>
                  Category: {product.category} | Stock: {product.stock}
                </span>
                {product.imageUrl && (
                  <img src={product.imageUrl} alt={product.name} />
                )}
                <div>
                  <button onClick={() => handleEdit(product)}>Edit</button>
                  <button onClick={() => handleDelete(product._id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p>No products available.</p>
          )}
        </ul>
      </div>
    </>
  );
};

export default Admin;
