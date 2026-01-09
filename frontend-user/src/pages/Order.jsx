import { useEffect, useState } from "react";
import api from "../api/api";

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/orders/my")
      .then((res) => setOrders(res.data))
      .catch(() => {});
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>

      {orders.map((o) => (
        <div key={o._id} className="border p-4 mb-4 rounded">
          <p>Status: {o.status}</p>
          <p>Total: ₹{o.totalAmount}</p>
        </div>
      ))}
    </div>
  );
}

export default Orders;
