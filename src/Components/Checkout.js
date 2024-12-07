import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";
import Navbar from "./../Components/Navbar";
import BACKEND_URL from "../Components/config";

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Fetch cart data when the component mounts
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
    const fetchCart = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/cart/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch cart");
        const data = await response.json();
        setCartItems(data.items || []);
        const total = data.items.reduce(
          (acc, item) =>
            acc + (item.product ? item.product.price * item.quantity : 0),
          0
        );
        setTotalAmount(total);
      } catch (error) {
        console.error("Error fetching cart:", error);
        setError("Could not load cart details.");
      }
    };

    fetchCart();
  }, []);

  const handleCheckout = async (e) => {
    e.preventDefault();

    // Ensure cart is not empty
    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    // Log the raw cartItems
    console.log("Cart Items:", cartItems);

    // Prepare cart items in the correct format
    const formattedItems = cartItems.map((item) => ({
      productId: item.product?._id, // Ensure you use the correct product ID
      quantity: item.quantity,
      price: item.product?.price, // Ensure price is available
    }));

    // Log the formatted items
    console.log("Formatted Items:", formattedItems);

    try {
      const response = await fetch(`${BACKEND_URL}/payment/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          items: formattedItems,
          amount: totalAmount,
          paymentMethod,
        }),
      });

      if (!response.ok) throw new Error("Checkout failed");

      const data = await response.json();
      setSuccessMessage("Checkout successful! Order ID: " + data.orderId);
      setError("");

      // Clear cart on the backend
      await fetch(`${BACKEND_URL}/cart/remove`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });

      setCartItems([]); // Clear the cart after successful checkout
      setTotalAmount(0);
    } catch (error) {
      setError(error.message);
    }
  };
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
      <div className="checkout-container">
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <h3 id="cart">Your Cart</h3>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul className="cart-list">
            {cartItems.map((item, index) =>
              item.product ? (
                <li key={item.product._id}>
                  <img
                    src={
                      item.product.imageUrl ||
                      `https://via.placeholder.com/150?text=${item.product.name}`
                    }
                    alt={item.product.name}
                    onLoad={() => console.log("Image loaded!")}
                    className="product-image"
                  />
                  <span>
                    {item.product.name} - ${item.product.price}
                  </span>
                  <span className="quantity">x {item.quantity}</span>
                </li>
              ) : (
                <li key={index} className="invalid">
                  Invalid item in cart
                </li>
              )
            )}
          </ul>
        )}
        <h3>Total Amount: ${totalAmount.toFixed(2)}</h3>
        <form onSubmit={handleCheckout}>
          <div>
            <label>
              Payment Method:
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="Credit Card">Credit Card</option>
                <option value="PayPal">PayPal</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </label>
          </div>
          <button type="submit">Complete Checkout</button>
        </form>
      </div>
    </>
  );
};

export default Checkout;
