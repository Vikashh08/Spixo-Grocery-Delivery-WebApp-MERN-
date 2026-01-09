import { Routes, Route, Navigate } from "react-router-dom";
import DeliveryLogin from "./pages/DeliveryLogin";
import DeliveryOrders from "./pages/DeliveryOrders";

// This component checks for the token before allowing access
const ProtectedFleetRoute = ({ children }) => {
  const token = localStorage.getItem("deliveryToken");
  
  // If no token exists, send them back to the login page
  if (!token) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<DeliveryLogin />} />
      
      <Route 
        path="/orders" 
        element={
          <ProtectedFleetRoute>
            <DeliveryOrders />
          </ProtectedFleetRoute>
        } 
      />

      {/* Catch-all: Redirect unknown paths to login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;