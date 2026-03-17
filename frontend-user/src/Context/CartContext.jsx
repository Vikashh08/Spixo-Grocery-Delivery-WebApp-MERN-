import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const isInitialized = useRef(false);
  
  // Use a user-specific storage key to prevent cross-account leakage
  const getStorageKey = useCallback(() => {
    return user ? `spixo_cart_${user._id}` : "spixo_cart_guest";
  }, [user]);

  // Load cart when user changes
  useEffect(() => {
    isInitialized.current = false; // Reset on user change
    const savedCart = localStorage.getItem(getStorageKey());
    setCartItems(savedCart ? JSON.parse(savedCart) : []);
    isInitialized.current = true; // Mark as ready to sync
  }, [getStorageKey]);

  // Save cart whenever items change
  useEffect(() => {
    // CRITICAL: Only save if we have finished loading for the current user session.
    // This prevents a race condition where the previous user's state is saved 
    // to the new user's key before the new user's items are loaded.
    if (isInitialized.current && getStorageKey()) {
      localStorage.setItem(getStorageKey(), JSON.stringify(cartItems));
    }
  }, [cartItems, getStorageKey]);

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(getStorageKey());
  };

  const addToCart = (product) => {
    const exist = cartItems.find((item) => item._id === product._id);
    const minQty = product.minOrderQuantity || 1;
    const maxQty = product.maxOrderQuantity || 10;
    const currentStock = product.stock || 0;

    if (exist) {
      if (exist.quantity >= maxQty) {
        toast.error(`Maximum limit of ${maxQty} reached for this item`, {
          style: { borderRadius: '16px', background: '#333', color: '#fff', fontSize: '11px' }
        });
        return;
      }

      if (exist.quantity >= currentStock) {
        toast.error("Not enough stock available", {
          style: { borderRadius: '16px', background: '#333', color: '#fff', fontSize: '11px' }
        });
        return;
      }

      setCartItems((prev) =>
        prev.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
      return;
    }

    // Fresh addition
    if (currentStock < minQty) {
      toast.error("Not enough stock for minimum order quantity", {
        style: { borderRadius: '16px', background: '#333', color: '#fff', fontSize: '11px' }
      });
      return;
    }

    setCartItems((prev) => [...prev, { ...product, quantity: minQty }]);
    
    // Add toast notification for new items
    toast.success(`${product.name} added to cart`, {
      style: {
        borderRadius: '16px',
        background: '#333',
        color: '#fff',
        fontSize: '12px',
        fontWeight: 'bold',
        padding: '12px 24px',
      },
      iconTheme: {
        primary: '#10b981',
        secondary: '#fff',
      },
    });
  };

  const decreaseQty = (id) => {
    const exist = cartItems.find((item) => item._id === id);
    if (!exist) return;

    const minQty = exist.minOrderQuantity || 1;

    if (exist.quantity <= minQty) {
      setCartItems((prev) => prev.filter((item) => item._id !== id));
      toast.success(`${exist.name} removed from cart`, {
        style: { borderRadius: '16px', background: '#333', color: '#fff', fontSize: '11px' }
      });
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, quantity: item.quantity - 1 } : item
      )
    );
  };

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, decreaseQty, totalAmount, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);