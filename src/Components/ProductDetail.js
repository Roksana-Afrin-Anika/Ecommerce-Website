import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductDetail.css";
import Navbar from "./../Components/Navbar";
const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:3000/product/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProduct(data.product || data); // Ensure data.products exists
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      const response = await fetch("http://localhost:3000/cart/add", {
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

  useEffect(() => {
    fetchProducts();
  }, []);

  // Navigate to profile page
  const goToProfile = () => {
    navigate("/profile"); // Adjust the path based on your routing setup
  };

  if (loading) return <div>Loading product details...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <>
      <Navbar />
      <div className="product-container">
        <div className="button-group">
          <button onClick={goToProfile} className="profile-button">
            My Profile
          </button>
          <button onClick={() => navigate("/cart")} className="cart-button">
            Cart
          </button>
        </div>
        <ul>
          {Array.isArray(product) && product.length > 0 ? (
            product.map((product) => (
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
                <button onClick={() => handleAddToCart(product._id)}>
                  Add to Cart
                </button>
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

export default ProductDetail;
