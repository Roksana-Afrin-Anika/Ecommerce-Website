import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";
import Navbar from "./../Components/Navbar";
import BACKEND_URL from "./Components/config";
const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
    // Fetch the cart items on component mount
    const fetchCart = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/cart/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch cart");
        }

        const data = await response.json();
        setCart(data.items || []);
        setLoading(false);
      } catch (err) {
        setError("Failed to load cart");
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleRemove = async (productId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/cart/remove`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove item");
      }

      const data = await response.json();
      setCart(data.cart.items);
    } catch (err) {
      setError("Failed to remove item");
    }
  };

  const handleUpdateQuantity = async (productId, quantity) => {
    try {
      if (quantity <= 0) return; // Prevent updating to a non-positive quantity

      const updatedQuantity = Math.max(1, quantity); // Prevent going below 1

      const response = await fetch(`${BACKEND_URL}/cart/update`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, quantity: updatedQuantity }),
      });

      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }

      const data = await response.json();
      setCart(data.cart.items); // Update the cart with the response
    } catch (err) {
      setError("Failed to update quantity");
    }
  };
  if (loading) {
    return <p>Loading cart...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }
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
    navigate("/");
  };
  return (
    <>
      <Navbar />
      {isLoggedIn && <Sidebar onLogout={handleLogout} />}
      <div className="cart-container">
        <h1>Your Cart</h1>
        {cart.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <ul>
            {cart.map((item) =>
              item.product ? (
                <li key={item.product._id} className="cart-item">
                  <img
                    key={item.product.imageUrl || "placeholder"} // Unique key for re-rendering
                    src={
                      item.product.imageUrl ||
                      `https://via.placeholder.com/150?text=${encodeURIComponent(
                        item.product.name
                      )}`
                    }
                    alt={item.product.name}
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/150?text=${encodeURIComponent(
                        item.product.name
                      )}`;
                    }}
                    className="product-image"
                  />
                  <div className="product-details">
                    <h2>{item.product.name}</h2>
                    <p>Price: ${item.product.price}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Total Price: ${item.product.price * item.quantity}</p>
                    <div className="quantity-controls">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(
                            item.product._id,
                            item.quantity - 1
                          )
                        }
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleUpdateQuantity(
                            item.product._id,
                            parseInt(e.target.value) || 1
                          )
                        }
                      />
                      <button
                        onClick={() =>
                          handleUpdateQuantity(
                            item.product._id,
                            item.quantity + 1
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemove(item.product._id)}
                      className="remove-button"
                    >
                      Remove from cart
                    </button>
                  </div>
                </li>
              ) : (
                <li key={Math.random()} className="cart-item">
                  <p>Invalid item detected</p>
                </li>
              )
            )}
          </ul>
        )}
      </div>
      <button
        className="checkout-button"
        onClick={() => {
          setCart([]);
          navigate("/checkout");
        }} // Navigate to checkout
      >
        Proceed to Checkout
      </button>
    </>
  );
};

export default Cart;
