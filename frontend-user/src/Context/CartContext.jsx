import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("spixo_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("spixo_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // 1. ADD THIS FUNCTION
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("spixo_cart");
  };

  const addToCart = (product) => {
    setCartItems((prev) => {
      const exist = prev.find((item) => item._id === product._id);
      if (exist) {
        return prev.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const decreaseQty = (id) => {
    setCartItems((prev) => {
      const exist = prev.find((item) => item._id === id);
      if (exist?.quantity === 1) return prev.filter((item) => item._id !== id);
      return prev.map((item) =>
        item._id === id ? { ...item, quantity: item.quantity - 1 } : item
      );
    });
  };

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    // 2. ENSURE clearCart IS ADDED HERE
    <CartContext.Provider value={{ cartItems, addToCart, decreaseQty, totalAmount, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);