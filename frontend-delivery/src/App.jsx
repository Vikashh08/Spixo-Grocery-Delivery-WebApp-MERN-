import { useState, useEffect } from "react";
import LoadingBar from "./components/LoadingBar";
import api, { setProgressBar } from "./api/api";
import { Toaster } from "react-hot-toast";

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
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    setProgressBar(setLoadingProgress);
  }, []);

  return (
    <>
      <LoadingBar progress={loadingProgress} />
      <Toaster position="top-right" />
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
    </>
  );
}

export default App;