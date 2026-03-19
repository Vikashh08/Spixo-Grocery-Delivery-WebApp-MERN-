import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import ProtectedRoute from "./Route/ProtectedRoute";
import AddProduct from "./Pages/AddProduct";
import ManageProducts from "./Pages/ManageProducts";
import Orders from "./Pages/Orders";
import AddDelivery from "./Pages/AddDelivery";
import ManageDelivery from "./Pages/ManageDelivery";
import Settings from "./Pages/Settings";
import ManageUsers from "./Pages/ManageUsers";
import { createContext, useContext, useState, useEffect } from "react";
import LoadingBar from "./Components/LoadingBar";
import api, { setProgressBar } from "./api/api";

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
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute><ManageUsers /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </LoadingContext.Provider>
  );
}

export default App;
