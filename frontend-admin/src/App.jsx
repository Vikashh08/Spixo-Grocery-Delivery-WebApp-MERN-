import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import AddProduct from "./pages/AddProduct";
import ManageProducts from "./pages/ManageProducts";
import Orders from "./pages/Orders";
import AddDelivery from "./pages/AddDelivery";
import ManageDelivery from "./pages/ManageDelivery";
import SupportMessages from "./pages/SupportMessages";
import Settings from "./pages/Settings";
import ManageUsers from "./pages/ManageUsers";
import { createContext, useContext, useState, useEffect } from "react";
import LoadingBar from "./components/LoadingBar";
import api, { setProgressBar } from "./api/api";
import Navbar from "./components/Navbar";

export const LoadingContext = createContext();

function App() {
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    setProgressBar(setLoadingProgress);
  }, []);

  return (
    <LoadingContext.Provider value={{ setLoadingProgress }}>
      <LoadingBar progress={loadingProgress} />
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Management Suite */}
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/products" element={<ProtectedRoute><ManageProducts /></ProtectedRoute>} />
          <Route path="/add-product" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/add-delivery" element={<ProtectedRoute><AddDelivery /></ProtectedRoute>} />
          <Route path="/manage-delivery" element={<ProtectedRoute><ManageDelivery /></ProtectedRoute>} />
          <Route path="/support" element={<ProtectedRoute><SupportMessages /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute><ManageUsers /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </LoadingContext.Provider>
  );
}

export default App;
