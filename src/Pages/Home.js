import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import Navbar from "./../Components/Navbar";
import "./Home.css";
import "../App.css";
import BACKEND_URL from "../Components/config";

const Home = () => {
  const { t } = useTranslation();
  const aboutUsRef = useRef(null);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const scrollToAboutUs = () => {
    aboutUsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/product/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data.product || data);
      const uniqueCategories = [
        ...new Set(data.map((product) => product.category)),
      ];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      alert("You need to sign up or log in first!");
      navigate("/register");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/cart/add`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        throw new Error("Failed to add item to cart");
      }

      const data = await response.json();
      if (data.success) {
        alert("Product added to cart successfully!");
      } else {
        console.log("Failed to add product to cart.");
      }
    } catch (err) {
      console.error("Error adding product to cart:", err);
    }
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleImageClick = (url) => {
    setSelectedImageUrl(url);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetchProducts();
    const token = sessionStorage.getItem("token");
    setIsLoggedIn(!!token); // Set to true if a token exists
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      (!selectedCategory || product.category === selectedCategory) &&
      (!searchQuery ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  const Sidebar = ({ onLogout }) => (
    <div className="sidebar">
      <ul>
        <li>
          <button onClick={() => navigate("/profile")}>Profile</button>
        </li>
        <li>
          <button onClick={() => navigate("/cart")}>Cart</button>
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
  };

  return (
    <>
      <Navbar
        onAboutUsClick={scrollToAboutUs}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      {isLoggedIn && <Sidebar onLogout={handleLogout} />}
      <div className="filter-container">
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="category-select"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div className="product-container">
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
                    <button
                      onClick={() => handleImageClick(product.imageUrl)}
                      className="image-button"
                    >
                      <img src={product.imageUrl} alt={product.name} />
                    </button>
                  )}
                  <button onClick={() => handleAddToCart(product._id)}>
                    Add to Cart
                  </button>
                </li>
              ))
            ) : (
              <p>No products found in this category. Try another one!</p>
            )}
          </ul>
        </div>
      )}

      {isModalOpen && (
        <div className="modal" onClick={closeModal}>
          <img
            src={selectedImageUrl}
            alt="Large View"
            className="modal-image"
          />
        </div>
      )}

      <hr className="section-divider" />
      <section id="about-us" ref={aboutUsRef} className="about-us-container">
        <h2>{t("aboutUs")}</h2>
        <p>{t("OV")}</p>

        <h3>{t("OurVision")}</h3>

        <h3>{t("WhyChooseUs")}</h3>
        <div dangerouslySetInnerHTML={{ __html: t("WCU") }} />
      </section>
    </>
  );
};

export default Home;
