import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import { AiOutlinePhone, AiOutlineEnvironment, AiOutlineCheckCircle, AiOutlineLogout } from "react-icons/ai";
import { TbPackage, TbTruck } from "react-icons/tb"; // Stable imports

function DeliveryOrders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const fetchAssigned = () => {
    // Hits /api/delivery/orders
    api.get("/delivery/orders")
      .then((res) => setOrders(res.data))
      .catch(() => {});
  };

  useEffect(() => { 
    fetchAssigned(); 
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      // Hits /api/orders/status
      await api.post("/orders/status", { orderId, status });
      fetchAssigned(); // Refresh list to show next button
    } catch {
      alert("Status update failed. Please check your internet.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("deliveryToken");
    navigate("/");
  };

  return (
    <div className="bg-[#fdfcfb] min-h-screen p-6 pb-24 font-sans">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-800 tracking-tight">Active Tasks</h1>
          <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest mt-1">Fleet Operational</p>
        </div>
        <button 
          onClick={handleLogout}
          className="w-10 h-10 bg-white border border-stone-100 rounded-full flex items-center justify-center text-stone-400 hover:text-red-500 transition-colors"
        >
          <AiOutlineLogout size={18} />
        </button>
      </header>

      {orders.length === 0 ? (
        <div className="text-center py-24 bg-white border border-stone-100 rounded-[3rem] shadow-sm">
          <p className="text-stone-400 italic">"Standby. No active assignments found."</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white border border-stone-100 rounded-[2.5rem] p-6 shadow-md border-l-4 border-l-blue-600">
              
              <div className="flex justify-between items-center mb-6">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-blue-100">
                  {order.status}
                </span>
                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">
                  Slot: {order.deliverySlot}
                </p>
              </div>

              {/* Address & Contact Card */}
              <div className="bg-stone-50 rounded-2xl p-5 mb-6 space-y-4">
                <div>
                   <p className="text-[10px] text-stone-400 uppercase font-bold tracking-tighter mb-1">Customer</p>
                   <p className="text-stone-800 font-bold text-lg">{order.userId?.name || "Guest"}</p>
                </div>
                
                <div className="flex items-start gap-3">
                  <AiOutlineEnvironment className="text-blue-600 mt-1 shrink-0" size={18} />
                  <p className="text-stone-600 text-sm font-medium leading-relaxed">{order.userId?.address}</p>
                </div>

                <a 
                  href={`tel:${order.userId?.phone}`} 
                  className="flex items-center justify-center gap-2 w-full py-3 border border-blue-100 bg-blue-50/50 text-blue-700 rounded-xl text-xs font-bold transition-all active:scale-95"
                >
                  <AiOutlinePhone size={16} /> CALL CUSTOMER
                </a>
              </div>

              {/* Dynamic Status Controls */}
              <div className="space-y-3">
                {order.status === "ASSIGNED" && (
                  <button 
                    onClick={() => updateStatus(order._id, "PICKED")} 
                    className="w-full py-5 bg-stone-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all"
                  >
                    <TbPackage size={20} /> MARK AS PICKED
                  </button>
                )}

                {order.status === "PICKED" && (
                  <button 
                    onClick={() => updateStatus(order._id, "ON_THE_WAY")} 
                    className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all"
                  >
                    <TbTruck size={20} /> START DELIVERY
                  </button>
                )}

                {order.status === "ON_THE_WAY" && (
                  <button 
                    onClick={() => updateStatus(order._id, "DELIVERED")} 
                    className="w-full py-5 bg-emerald-700 text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all"
                  >
                    <AiOutlineCheckCircle size={20} /> CONFIRM ARRIVAL
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DeliveryOrders;