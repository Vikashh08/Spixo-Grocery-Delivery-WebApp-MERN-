import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [partners, setPartners] = useState([]);
  const navigate = useNavigate();

  const fetchOrders = () => {
    // Hits /api/orders
    api.get("/orders").then((res) => setOrders(res.data)).catch(() => {});
  };

  useEffect(() => {
    fetchOrders();
    // Hits /api/delivery
    api.get("/delivery").then((res) => setPartners(res.data)).catch(() => {});
  }, []);

  const assignOrder = async (orderId, deliveryPartnerId) => {
    try {
      // Hits /api/orders/assign
      await api.post("/orders/assign", { orderId, deliveryPartnerId });
      fetchOrders();
    } catch { alert("Assignment failed."); }
  };

  return (
    <div className="bg-[#fdfcfb] min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate("/")} className="text-stone-400 hover:text-stone-800 mb-8 flex items-center gap-2 font-bold text-xs tracking-widest"><AiOutlineArrowLeft /> BACK</button>
        <h2 className="text-3xl font-serif font-bold text-stone-800 mb-10">Live Orders</h2>
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white border border-stone-100 rounded-[2.5rem] p-8 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-bold text-stone-800">{order.userId?.name}</p>
                  <p className="text-xs text-stone-400">{order.userId?.address}</p>
                </div>
                <p className="font-serif font-bold text-emerald-800 text-xl">₹{order.totalAmount}</p>
              </div>
              {order.status === "PLACED" && (
                <select defaultValue="" onChange={(e) => assignOrder(order._id, e.target.value)} className="w-full px-4 py-3 bg-stone-50 rounded-xl outline-none text-xs font-bold uppercase">
                  <option value="" disabled>Assign Fleet Partner</option>
                  {partners.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Orders;