import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowLeft, AiOutlinePhone, AiOutlineHome, AiOutlineMail, AiOutlineClockCircle, AiOutlineEnvironment } from "react-icons/ai";

const STATUS_COLORS = {
  PLACED:     "bg-amber-100 text-amber-700 border-amber-200",
  ASSIGNED:   "bg-blue-100 text-blue-700 border-blue-200",
  PICKED:     "bg-indigo-100 text-indigo-700 border-indigo-200",
  ON_THE_WAY: "bg-purple-100 text-purple-700 border-purple-200",
  DELIVERED:  "bg-emerald-100 text-emerald-700 border-emerald-200",
  CANCELLED:  "bg-red-100 text-red-700 border-red-200",
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const navigate = useNavigate();

  const fetchOrders = () => {
    api.get("/orders").then((res) => setOrders(res.data)).catch(() => {});
  };

  useEffect(() => {
    fetchOrders();
    api.get("/delivery").then((res) => setPartners(res.data)).catch(() => {});
    setLoading(false);
  }, []);

  const assignOrder = async (orderId, deliveryPartnerId) => {
    if (!deliveryPartnerId) return;
    try {
      await api.put(`/orders/${orderId}/assign`, { deliveryPartnerId });
      fetchOrders();
    } catch {
      alert("Assignment failed. Partner may be offline.");
    }
  };

  const filteredOrders = filter === "ALL" ? orders : orders.filter(o => o.status === filter);

  if (loading) return <div className="p-10 text-center text-stone-400 animate-pulse">Loading orders...</div>;

  return (
    <div className="bg-[#fcfaf8] min-h-screen py-10 px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation */}
        <button
          onClick={() => navigate("/")}
          className="text-stone-400 hover:text-stone-800 mb-8 flex items-center gap-2 font-bold text-xs tracking-widest transition-colors"
        >
          <AiOutlineArrowLeft /> ADMIN DASHBOARD
        </button>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <h2 className="text-4xl font-serif font-bold text-stone-800 tracking-tight">Manage Orders</h2>
            <div className="flex gap-4 mt-3 overflow-x-auto pb-2 scrollbar-hide">
              {["ALL", "PLACED", "ASSIGNED", "PICKED", "ON_THE_WAY", "DELIVERED", "CANCELLED"].map(s => (
                <button 
                  key={s} 
                  onClick={() => setFilter(s)}
                  className={`text-[10px] font-black px-4 py-2 rounded-xl border uppercase tracking-wider transition-all whitespace-nowrap ${
                    filter === s ? "bg-stone-900 text-white border-stone-900 shadow-lg" : "bg-white text-stone-400 border-stone-100 hover:border-stone-200"
                  }`}
                >
                  {s.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>
          <p className="text-stone-400 text-xs font-bold uppercase tracking-widest hidden md:block">
            {filteredOrders.length} records matching search
          </p>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-32 bg-white border border-stone-100 rounded-[3rem] shadow-sm">
             <p className="text-stone-300 font-serif text-xl italic">"No orders found for this criteria."</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white border border-stone-100 rounded-[2.5rem] p-8 shadow-sm flex flex-col relative overflow-hidden group hover:shadow-xl transition-all"
              >
                {/* Status Bar */}
                <div className={`absolute left-0 top-0 h-full w-2 ${STATUS_COLORS[order.status]?.split(" ")[0]}`}></div>

                {/* Header row */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <p className="text-[10px] text-stone-400 font-black uppercase tracking-widest mb-1.5">Customer Info</p>
                    <h3 className="font-bold text-stone-800 text-xl leading-tight">
                      {order.userId?.name || order.userName || "Guest Customer"}
                    </h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-stone-400 font-black uppercase tracking-widest mb-1.5">Order Total</p>
                    <p className="font-serif font-bold text-emerald-800 text-2xl tracking-tighter">₹{order.totalAmount}</p>
                  </div>
                </div>

                {/* Contact Card */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 bg-stone-50/50 rounded-3xl p-6 border border-stone-50">
                  <div className="space-y-2">
                     <div className="flex items-center gap-2 text-stone-500 text-xs font-medium">
                        <AiOutlineMail className="shrink-0" /> {order.userId?.email || "No email"}
                     </div>
                     <div className="flex items-center gap-2 text-stone-500 text-xs font-medium">
                        <AiOutlinePhone className="shrink-0" /> {order.userId?.phone || order.userPhone || "No contact"}
                     </div>
                  </div>
                  <div className="flex items-start gap-2 text-stone-500 text-xs font-medium leading-relaxed">
                     <AiOutlineEnvironment className="shrink-0 mt-0.5 text-indigo-500" />
                     {order.address ? (
                         <span>{[order.address.house, order.address.street, order.address.area, order.address.pincode].filter(Boolean).join(", ")}</span>
                     ) : "Pickup Order / No Address"}
                  </div>
                </div>

                {/* Item manifest */}
                <div className="mb-8">
                   <p className="text-[10px] text-stone-400 font-black uppercase tracking-widest mb-3">Items Ordered</p>
                   <div className="flex flex-wrap gap-2">
                      {order.items?.map((item, i) => (
                        <div key={i} className="bg-stone-100/50 text-stone-600 px-3 py-1.5 rounded-xl text-[11px] font-bold border border-stone-100 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-stone-400 rounded-full"></span>
                          {item.name} <span className="text-stone-400 font-medium">× {item.quantity}</span>
                        </div>
                      ))}
                   </div>
                </div>

                {/* Logistics */}
                <div className="grid grid-cols-2 gap-6 mb-8 pt-6 border-t border-stone-50">
                   <div>
                     <p className="text-[10px] text-stone-400 font-black uppercase tracking-widest mb-1.5">Delivery Speed</p>
                     <div className="flex items-center gap-2 text-stone-700 text-xs font-black">
                        <AiOutlineClockCircle className="text-amber-500" />
                        {order.deliverySlot === "FAST" ? "Hyperlocal (30-45m)" : "Standard (Evening Slot)"}
                     </div>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] text-stone-400 font-black uppercase tracking-widest mb-1.5">Order Status</p>
                      <span className={`text-[10px] font-black px-3 py-1.5 rounded-full border uppercase tracking-wider ${STATUS_COLORS[order.status]}`}>
                        {order.status}
                      </span>
                   </div>
                </div>

                {/* Actionable: Assign Partner */}
                <div className="mt-auto pt-6 border-t border-stone-50">
                   {order.status === "PLACED" ? (
                     <div>
                        <p className="text-[10px] text-stone-400 font-black uppercase tracking-widest mb-3">Assign Delivery Partner</p>
                        <select
                          defaultValue=""
                          onChange={(e) => assignOrder(order._id, e.target.value)}
                          className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl outline-none text-xs font-black text-stone-700 hover:bg-white focus:ring-2 focus:ring-stone-200 transition-all appearance-none cursor-pointer"
                        >
                          <option value="" disabled>Select available partner...</option>
                          {partners.map((p) => (
                            <option key={p._id} value={p._id} disabled={!p.isActive}>
                              {p.name} {p.isActive ? "—" : "[DISABLED] —"} {p.email}
                            </option>
                          ))}
                        </select>
                     </div>
                   ) : (
                     <div className="flex items-center justify-between px-2">
                        <div className="flex flex-col">
                           <p className="text-[10px] text-stone-400 font-black uppercase tracking-widest">Delivery Partner</p>
                           <p className="text-stone-800 text-xs font-black mt-0.5">{order.deliveryPartnerId?.name || "Unassigned"}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-stone-400 font-black uppercase tracking-widest">Phone</p>
                            <p className="text-stone-500 text-[11px] font-bold mt-0.5">{order.deliveryPartnerId?.phone || "—"}</p>
                        </div>
                     </div>
                   )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;