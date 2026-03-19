import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import { 
  AiOutlinePhone, 
  AiOutlineEnvironment, 
  AiOutlineCheckCircle, 
  AiOutlineLogout, 
  AiOutlineHome, 
  AiOutlineUser,
  AiOutlineHistory,
  AiOutlineCalendar,
  AiOutlineDollarCircle,
  AiOutlineClockCircle
} from "react-icons/ai";
import { TbPackage, TbTruck, TbListCheck } from "react-icons/tb";

function DeliveryOrders() {
  const [activeTab, setActiveTab] = useState("home");
  const [orders, setOrders] = useState([]);
  const [history, setHistory] = useState([]);
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, historyRes, meRes] = await Promise.all([
        api.get("/delivery/orders"),
        api.get("/delivery/history"),
        api.get("/delivery/me")
      ]);
      setOrders(ordersRes.data);
      setHistory(historyRes.data);
      setPartner(meRes.data);
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      fetchData(); 
    } catch {
      alert("Status update failed.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("deliveryToken");
    navigate("/");
  };

  const todayOrders = history.filter(o => {
    const today = new Date().toDateString();
    return new Date(o.deliveredAt).toDateString() === today;
  }).length;

  const todayEarnings = history.reduce((acc, o) => {
    const today = new Date().toDateString();
    if (new Date(o.deliveredAt).toDateString() === today) {
      return acc + (o.deliveryCharge || 20); // Fallback to 20 if charge not set
    }
    return acc;
  }, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pb-28 font-sans">
      {/* Header */}
      <header className="p-6 flex justify-between items-center transition-all">
        <div className="flex items-center gap-4 animate-slide-up">
          <img src="/logo.ico" alt="Spixo" className="w-10 h-10 object-contain rounded-xl shadow-sm border border-slate-100" />
          <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {activeTab === "home" && `Hey, ${partner?.name?.split(" ")[0]}! 👋`}
            {activeTab === "tasks" && "Active Tasks"}
            {activeTab === "history" && "Past Deliveries"}
            {activeTab === "profile" && "My Profile"}
          </h1>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mt-1">
            {partner?.isActive ? "● Online & Active" : "○ Offline"}
          </p>
        </div>
      </div>
      <button 
          onClick={handleLogout}
          className="w-10 h-10 bg-white shadow-sm border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-red-500 transition-all active:scale-95"
        >
          <AiOutlineLogout size={18} />
        </button>
      </header>

      {/* Main Content */}
      <main className="px-6">
        {activeTab === "home" && (
          <div className="space-y-6 animate-slide-up">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="stat-card">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-2">
                  <TbListCheck size={20} />
                </div>
                <span className="text-2xl font-bold text-slate-900">{todayOrders}</span>
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-tight">Today's Tasks</span>
              </div>
              <div className="stat-card">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-2">
                  <AiOutlineDollarCircle size={20} />
                </div>
                <span className="text-2xl font-bold text-slate-900">₹{todayEarnings}</span>
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-tight">Today's Pay</span>
              </div>
            </div>

            {/* Shift Summary */}
            <div className="bg-slate-900 rounded-[2rem] p-6 text-white overflow-hidden relative shadow-xl shadow-slate-200">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-3xl -mr-10 -mt-10"></div>
              <h3 className="text-lg font-bold mb-1">Shift In Progress</h3>
              <p className="text-slate-400 text-xs mb-6">Started at {new Date(partner?.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
              
              <div className="flex items-center gap-4">
                <div className="flex-1 p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/5">
                  <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Total Earned</p>
                  <p className="text-xl font-bold">₹{history.reduce((acc, o) => acc + (o.deliveryCharge || 20), 0)}</p>
                </div>
                <div className="flex-1 p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/5">
                  <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Deliveries</p>
                  <p className="text-xl font-bold">{history.length}</p>
                </div>
              </div>
            </div>

            {/* Next Task Preview */}
            {orders.length > 0 ? (
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-slate-800">Next Task</h4>
                  <button onClick={() => setActiveTab("tasks")} className="text-blue-600 text-xs font-bold uppercase tracking-wider">View All</button>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center shrink-0">
                    <AiOutlineEnvironment className="text-blue-600" size={24} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="font-bold text-slate-900 truncate">{orders[0].userId?.address}</p>
                    <p className="text-slate-400 text-xs truncate">For {orders[0].userId?.name}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-100 rounded-3xl p-8 text-center">
                <p className="text-blue-600 font-bold mb-1 italic">"No active tasks right now."</p>
                <p className="text-blue-400 text-xs">Stay online to receive new orders.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "tasks" && (
          <div className="space-y-6 animate-slide-up">
            {orders.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <TbListCheck size={40} />
                </div>
                <p className="text-slate-400 italic">No pending assignments found.</p>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order._id} className="bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm border-l-[6px] border-l-blue-600 animate-slide-up">
                  <div className="flex justify-between items-center mb-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                      order.status === 'ASSIGNED' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                      order.status === 'PICKED' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                      'bg-indigo-50 text-indigo-600 border-indigo-100'
                    }`}>
                      {order.status}
                    </span>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                      <AiOutlineClockCircle /> Slot: {order.deliverySlot}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-5 mb-6 space-y-4">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter mb-1">Customer</p>
                      <p className="text-slate-800 font-bold text-lg">{order.userId?.name || "Guest"}</p>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <AiOutlineEnvironment className="text-blue-600 mt-1 shrink-0" size={18} />
                      <p className="text-slate-600 text-sm font-medium leading-relaxed">{order.userId?.address}</p>
                    </div>

                    <div className="pt-4 border-t border-slate-200">
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter mb-2">Order Summary</p>
                      <div className="space-y-1">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-xs font-bold text-slate-700">
                            <span>{item.quantity}x {item.name}</span>
                            <span>₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <a 
                      href={`tel:${order.userId?.phone}`} 
                      className="flex items-center justify-center gap-2 w-full py-4 border border-blue-100 bg-blue-50/50 text-blue-700 rounded-xl text-xs font-bold transition-all active:scale-95 mt-4"
                    >
                      <AiOutlinePhone size={16} /> CALL CUSTOMER
                    </a>
                  </div>

                  {/* Dynamic Status Controls */}
                  <div className="space-y-3">
                    {order.status === "ASSIGNED" && (
                      <button 
                        onClick={() => updateStatus(order._id, "PICKED")} 
                        className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all"
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
                        className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all"
                      >
                        <AiOutlineCheckCircle size={20} /> CONFIRM ARRIVAL
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-4 animate-slide-up">
            {history.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <AiOutlineHistory size={40} />
                </div>
                <p className="text-slate-400 italic">No completed orders yet.</p>
              </div>
            ) : (
              history.map((order) => (
                <div key={order._id} className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                    <AiOutlineCheckCircle size={24} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-start">
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-tight">{new Date(order.deliveredAt).toLocaleDateString()}</p>
                      <p className="text-sm font-bold text-emerald-600">+₹{order.deliveryCharge || 20}</p>
                    </div>
                    <p className="font-bold text-slate-800 text-sm truncate">{order.userId?.address}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Order #{order._id.slice(-6)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "profile" && (
          <div className="space-y-6 animate-slide-up">
            <div className="text-center py-8">
              <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-100 text-white">
                <AiOutlineUser size={48} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">{partner?.name}</h2>
              <p className="text-slate-400 text-sm font-medium">{partner?.email}</p>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <AiOutlinePhone className="text-blue-600" /> Account Info
                </h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Phone Number</p>
                    <p className="text-slate-800 font-bold">{partner?.phone || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Partner Grade</p>
                    <p className="text-slate-800 font-bold">Standard Fleet</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <AiOutlineCalendar className="text-blue-600" /> Availability
                </h4>
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-slate-600">Online Status</p>
                  <div className={`w-12 h-6 rounded-full p-1 transition-all ${partner?.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-all ${partner?.isActive ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="w-full py-5 bg-red-50 text-red-600 font-bold rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95"
            >
              <AiOutlineLogout size={20} /> TERMINATE SHIFT
            </button>
          </div>
        )}
      </main>

      {/* Navigation Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 glass-card mx-6 my-8 rounded-[2.5rem] h-20 flex items-center justify-around px-4 z-50 animate-slide-up">
        <button 
          onClick={() => setActiveTab("home")}
          className={`nav-tab ${activeTab === "home" ? "active" : "text-slate-400"}`}
        >
          <div className={`icon-bg p-2 rounded-xl transition-all ${activeTab === "home" ? "bg-blue-100" : "bg-transparent"}`}>
            <AiOutlineHome size={22} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Home</span>
        </button>

        <button 
          onClick={() => setActiveTab("tasks")}
          className={`nav-tab ${activeTab === "tasks" ? "active" : "text-slate-400"}`}
        >
          <div className={`icon-bg p-2 rounded-xl transition-all ${activeTab === "tasks" ? "bg-blue-100" : "bg-transparent"}`}>
            <TbListCheck size={22} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Tasks</span>
        </button>

        <button 
          onClick={() => setActiveTab("history")}
          className={`nav-tab ${activeTab === "history" ? "active" : "text-slate-400"}`}
        >
          <div className={`icon-bg p-2 rounded-xl transition-all ${activeTab === "history" ? "bg-blue-100" : "bg-transparent"}`}>
            <AiOutlineHistory size={22} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest mt-1">History</span>
        </button>

        <button 
          onClick={() => setActiveTab("profile")}
          className={`nav-tab ${activeTab === "profile" ? "active" : "text-slate-400"}`}
        >
          <div className={`icon-bg p-2 rounded-xl transition-all ${activeTab === "profile" ? "bg-blue-100" : "bg-transparent"}`}>
            <AiOutlineUser size={22} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Profile</span>
        </button>
      </nav>
    </div>
  );
}

export default DeliveryOrders;