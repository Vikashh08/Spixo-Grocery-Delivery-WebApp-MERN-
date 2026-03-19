import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const fetchOrders = () => {
    api.get("/orders")
      .then((res) => setOrders(res.data))
      .catch(() => {});
  };

  const logout = () => {
    localStorage.removeItem("deliveryToken");
    navigate("/login");
  };

  const updateStatus = async (orderId, status) => {
    try {
      await api.post("/orders/status", { orderId, status });
      fetchOrders(); // refresh after update
    } catch {
      alert("Failed to update status");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
      <h2>Assigned Orders</h2>
      <button onClick={logout}>Logout</button>

      {orders.length === 0 && <p>No assigned orders</p>}

      {orders.map((order) => (
        <div
          key={order._id}
          style={{
            border: "1px solid #ccc",
            margin: "10px",
            padding: "10px",
          }}
        >
          <p><b>User:</b> {order.userId?.name}</p>
          <p><b>Phone:</b> {order.userId?.phone}</p>
          <p><b>Address:</b> {order.userId?.address}</p>
          <p><b>Status:</b> {order.status}</p>

          {/* Status Actions */}
          {order.status === "ASSIGNED" && (
            <button onClick={() => updateStatus(order._id, "PICKED")}>
              Picked
            </button>
          )}

          {order.status === "PICKED" && (
            <button onClick={() => updateStatus(order._id, "ON_THE_WAY")}>
              On the way
            </button>
          )}

          {order.status === "ON_THE_WAY" && (
            <button onClick={() => updateStatus(order._id, "DELIVERED")}>
              Delivered
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
