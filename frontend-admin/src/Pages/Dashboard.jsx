import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import {
  AiOutlineOrderedList,
  AiOutlineUserAdd,
  AiOutlineLogout,
  AiOutlineSetting,
  AiOutlineShoppingCart,
  AiOutlineTeam,
  AiOutlineAreaChart,
  AiOutlinePlusCircle,
  AiOutlineThunderbolt,
  AiOutlineShop,
  AiOutlineArrowUp,
  AiOutlineArrowDown
} from "react-icons/ai";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import toast from "react-hot-toast";

const COLORS = {
  primary: "#FFD700", // Blinkit Yellow
  success: "#00D26A", // Zepto Green
  dark: "#1A1A1A",
  light: "#F5F5F5"
};

function StatPill({ label, value, trend, icon, color }) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100 flex flex-col justify-between h-full group hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${color} text-white shadow-sm`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-[10px] font-black uppercase px-2 py-1 rounded-full ${trend > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            {trend > 0 ? <AiOutlineArrowUp /> : <AiOutlineArrowDown />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div>
        <p className="text-stone-400 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
        <h3 className="text-3xl font-black text-stone-900 tracking-tight">{value}</h3>
      </div>
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [storeOpen, setStoreOpen] = useState(true);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchSettings();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/dashboard");
      setStats(res.data);
      if (res.data.chartData) {
        setChartData(res.data.chartData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await api.get("/admin/settings");
      setStoreOpen(res.data.isStoreOpen);
    } catch {}
  };

  const toggleStore = async () => {
    try {
      const newStatus = !storeOpen;
      await api.put("/admin/settings", { isStoreOpen: newStatus });
      setStoreOpen(newStatus);
      toast.success(`Store is now ${newStatus ? 'OPEN' : 'CLOSED'}`, {
        icon: newStatus ? '✅' : '🔴',
        style: { borderRadius: '20px', background: '#333', color: '#fff', fontWeight: 'bold' }
      });
    } catch {
      toast.error("Failed to update store status");
    }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  return (
    <div className="bg-[#F8F9FB] min-h-screen font-sans">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-stone-100 px-6 py-4 sticky top-0 z-50 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <img src="/logo.ico" alt="Spixo" className="w-10 h-10 object-contain rounded-xl shadow-lg border border-stone-100" />
          <div>
            <h1 className="text-lg font-black text-stone-900 leading-none">Spixo Admin</h1>
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-1">Console v2.0</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 bg-stone-50 px-4 py-2 rounded-2xl border border-stone-100">
            <span className={`w-2.5 h-2.5 rounded-full ${storeOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
            <span className="text-[10px] font-bold text-stone-800 uppercase tracking-wider">
              {storeOpen ? 'Store is Live' : 'Store is Closed'}
            </span>
            <button 
              onClick={toggleStore}
              className={`w-12 h-6 rounded-full transition-all relative ${storeOpen ? 'bg-emerald-500' : 'bg-stone-300'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${storeOpen ? 'left-7' : 'left-1'}`}></div>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => navigate("/settings")} className="p-3 bg-white hover:bg-stone-50 rounded-2xl border border-stone-100 text-stone-400 hover:text-stone-900 transition-all shadow-sm">
              <AiOutlineSetting size={20} />
            </button>
            <button onClick={logout} className="p-3 bg-white hover:bg-rose-50 rounded-2xl border border-stone-100 text-stone-400 hover:text-rose-600 transition-all shadow-sm">
              <AiOutlineLogout size={20} />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">
        
        {/* Welcome Section */}
        <header className="mb-12">
          <h2 className="text-4xl font-black text-stone-900 tracking-tight mb-2">Welcome back, Partner!</h2>
          <div className="flex items-center gap-3 text-stone-400 font-bold text-sm tracking-wide">
            <AiOutlineThunderbolt className="text-amber-500" />
            <span>Store ID: SPIXO_MAINE_01</span>
            <span className="text-stone-200">|</span>
            <span>{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
          </div>
        </header>

        {loading ? (
          <div className="space-y-12">
            {/* Skeletons for Action Center */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-44 bg-white border border-stone-100 rounded-[2.5rem] animate-pulse" />
              ))}
            </div>
            {/* Skeletons for Stats & Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-8 space-y-8">
                 <div className="grid grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <div key={i} className="h-40 bg-white border border-stone-100 rounded-3xl animate-pulse" />)}
                 </div>
                 <div className="h-80 bg-white border border-stone-100 rounded-[3rem] animate-pulse" />
              </div>
              <div className="lg:col-span-4 h-full bg-white border border-stone-100 rounded-[3rem] animate-pulse" />
            </div>
          </div>
        ) : (
          <>
            {/* Action Center - Blinkit Style Large Buttons */}
            <section className="mb-12">
              <div className="flex items-center gap-4 mb-8">
                <h3 className="text-[11px] font-black text-stone-400 uppercase tracking-[0.3em]">Action Center</h3>
                <div className="h-px flex-1 bg-stone-100"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: "New Order", icon: <AiOutlinePlusCircle size={28}/>, color: "bg-indigo-600", path: "/orders", desc: "Create direct order" },
                  { label: "Add Product", icon: <AiOutlineShoppingCart size={28}/>, color: "bg-emerald-600", path: "/add-product", desc: "Add new item" },
                  { label: "Manage Products", icon: <AiOutlineOrderedList size={28}/>, color: "bg-blue-600", path: "/products", desc: "Edit inventory" },
                  { label: "Manage Fleet", icon: <AiOutlineTeam size={28}/>, color: "bg-amber-500", path: "/manage-delivery", desc: "Assign partners" },
                  { label: "User Database", icon: <AiOutlineShop size={28}/>, color: "bg-stone-900", path: "/users", desc: "Customer records" },
                ].map((item, idx) => (
                  <Link 
                    key={idx} 
                    to={item.path}
                    className="bg-white rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden flex flex-col items-center text-center gap-4"
                  >
                    <div className={`${item.color} text-white w-16 h-16 rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-stone-900 leading-tight">{item.label}</h4>
                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-1">{item.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              
              {/* Main Analytics Area */}
              <div className="lg:col-span-8 space-y-10">
                
                {/* Quick Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <StatPill label="Total Revenue" value={`₹${stats?.revenue || 0}`} trend={12.5} icon={<AiOutlineAreaChart size={24}/>} color="bg-stone-900"/>
                  <StatPill label="Live Orders" value={stats?.pendingOrders || 0} icon={<AiOutlineOrderedList size={24}/>} color="bg-indigo-600"/>
                  <StatPill label="Customers" value={stats?.totalUsers || 0} trend={2.1} icon={<AiOutlineTeam size={24}/>} color="bg-emerald-600"/>
                </div>

                {/* Analytics working Chart */}
                <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-stone-100">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="text-2xl font-black text-stone-900 tracking-tight">Revenue Trends</h3>
                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-1">Weekly Earnings Pulse</p>
                    </div>
                    <div className="bg-stone-50 px-4 py-2 rounded-2xl border border-stone-100 text-[10px] font-black uppercase tracking-widest text-stone-500">
                      Daily Overview
                    </div>
                  </div>

                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={COLORS.success} stopOpacity={0.3}/>
                            <stop offset="95%" stopColor={COLORS.success} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#d1d1d1', fontSize: 10, fontWeight: 'bold' }} 
                        />
                        <YAxis 
                          hide 
                        />
                        <Tooltip 
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontSize: '10px', fontWeight: 'bold' }}
                          cursor={{ stroke: COLORS.success, strokeWidth: 2, strokeDasharray: '5 5' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="rev" 
                          stroke={COLORS.success} 
                          strokeWidth={4}
                          fillOpacity={1} 
                          fill="url(#colorRev)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Recent Orders - Compact List */}
                <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-stone-100">
                  <div className="flex justify-between items-center mb-8 px-2">
                    <h3 className="text-2xl font-black text-stone-900 tracking-tight">Recent Orders</h3>
                    <Link to="/orders" className="text-[10px] font-black text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all uppercase tracking-widest">View All</Link>
                  </div>

                  <div className="space-y-4">
                    {stats?.recentOrders?.map((order, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 hover:bg-stone-50 rounded-3xl border border-stone-50 transition-all cursor-pointer group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-stone-300 border border-stone-100 group-hover:bg-stone-900 group-hover:text-white group-hover:border-stone-900 transition-all">
                            {order.userId?.name?.[0] || 'C'}
                          </div>
                          <div>
                            <p className="font-black text-stone-900 text-sm leading-none">{order.userId?.name || 'Verified Customer'}</p>
                            <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                              #{order._id.slice(-6).toUpperCase()} 
                              <span className="text-stone-200">•</span>
                              {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-stone-900 text-lg tracking-tight">₹{order.totalAmount}</p>
                          <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-lg mt-1 inline-block ${
                            order.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-600' : 
                            order.status === 'CANCELLED' ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="lg:col-span-4 space-y-10">
                
                {/* Top Products - Blinkit Style Mini List */}
                <div className={`bg-stone-900 rounded-[3rem] p-8 text-white relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <AiOutlineShoppingCart size={120} />
                  </div>

                  <h3 className="text-2xl font-black tracking-tight mb-8 relative z-10">Market Buzz</h3>
                  
                  <div className="space-y-6 relative z-10">
                    {stats?.topProducts?.map((p, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="bg-amber-500 w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black">
                            {idx + 1}
                          </div>
                          <div>
                            <p className="font-black text-sm uppercase tracking-wide leading-none">{p.name || 'Unknown Item'}</p>
                            <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1.5 italic">{p.count} units sold</p>
                          </div>
                        </div>
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
                      </div>
                    ))}
                    {!stats?.topProducts?.length && (
                      <p className="text-center py-10 opacity-30 italic">No sales data yet...</p>
                    )}
                  </div>

                  <button onClick={() => navigate("/add-delivery")} className="mt-10 w-full py-5 bg-white text-stone-900 rounded-[1.8rem] font-black text-[11px] uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3">
                    <AiOutlineUserAdd size={18} /> Recruit Partner
                  </button>
                </div>

                {/* Store Health */}
                <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-stone-100 flex flex-col items-center">
                  <div className="w-24 h-24 bg-indigo-50 rounded-[2.5rem] flex items-center justify-center mb-6 shadow-inner text-indigo-600">
                    <AiOutlineAreaChart size={40} />
                  </div>
                  <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] mb-2 text-center">Store Health</h4>
                  <p className="text-4xl font-black text-stone-900 mb-2 leading-none">94%</p>
                  <p className="text-stone-400 text-xs font-bold text-center px-4 mb-8">Performance is optimal. All systems are running at standard capacity.</p>
                  <div className="w-full bg-stone-50 rounded-2xl h-1.5 overflow-hidden mb-8">
                     <div className="bg-emerald-500 h-full w-[94%]" />
                  </div>
                  <button onClick={() => navigate("/settings")} className="w-full py-4 bg-stone-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-xl transition-all active:scale-95 whitespace-nowrap overflow-hidden">
                    Diagnostic Overview
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;