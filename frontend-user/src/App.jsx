import { Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./Components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderHistory from "./pages/OrderHistory";
import Profile from "./pages/Profile";
import UserLogin from "./pages/auth/UserLogin";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Register from "./pages/Register";
import OrderSuccess from "./pages/OrderSuccess";
import Contact from "./pages/Contact";
import MySupport from "./pages/MySupport";
import ProtectedRoute from "./routes/ProtectedRoute";
import Loader from "./Components/Loader";
import LoadingBar from "./components/LoadingBar.jsx";
import { setProgressBar } from "./api/api";
import { Toaster } from "react-hot-toast";
import { SettingsProvider } from "./context/SettingsContext";

// Pages that should NOT show the Navbar
const NO_NAVBAR_ROUTES = ["/login", "/register", "/forgot-password", "/reset-password"];

function App() {
  const location = useLocation();
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const showNavbar = !NO_NAVBAR_ROUTES.some(route => location.pathname.startsWith(route));

  useEffect(() => {
    setProgressBar(setLoadingProgress);
  }, []);

  useEffect(() => {
    // Check if the current navigation requested to skip the global loader
    // (e.g., from Checkout success where a beauty-loader already ran)
    if (location.state?.skipLoader) {
      setIsPageLoading(false);
      return;
    }

    setIsPageLoading(true);
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 1000); // 1 second delay as requested

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <SettingsProvider>
      <LoadingBar progress={loadingProgress} />
      <Toaster position="top-center" />
      {isPageLoading && <Loader />}
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/login" element={<UserLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/my-support" element={<ProtectedRoute><MySupport /></ProtectedRoute>} />

        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
        <Route path="/order-success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
    </SettingsProvider>
  );
}

export default App;
