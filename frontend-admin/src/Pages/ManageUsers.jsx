import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { 
  AiOutlineArrowLeft, 
  AiOutlineTeam, 
  AiOutlineSearch, 
  AiOutlineInbox, 
  AiOutlineClose,
  AiOutlineShopping
} from "react-icons/ai";

function ManageUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    api
      .get("/admin/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error fetching users:", err))
      .finally(() => setLoading(false));
  }, []);

  const fetchUserOrders = async (user) => {
    setSelectedUser(user);
    setOrdersLoading(true);
    setUserOrders([]);
    try {
      const res = await api.get(`/admin/users/${user._id}/orders`);
      setUserOrders(res.data);
    } catch (err) {
      console.error("Error fetching user orders:", err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.phone && u.phone.includes(search))
  );

  return (
    <div className="bg-[#fcfaf8] min-h-screen py-10 px-6 font-sans selection:bg-stone-200">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation */}
        <button
          onClick={() => navigate("/")}
          className="text-stone-400 hover:text-stone-800 mb-8 flex items-center gap-2 font-bold text-xs tracking-widest transition-colors uppercase"
        >
          <AiOutlineArrowLeft /> ADMIN DASHBOARD
        </button>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <h2 className="text-4xl font-serif font-bold text-stone-800 tracking-tight flex items-center gap-4">
              <AiOutlineTeam className="text-stone-300" /> User Directory
            </h2>
            <p className="text-stone-400 text-xs font-bold uppercase tracking-[0.2em] mt-2">Manage and view customer activities</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-10 group">
          <AiOutlineSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-stone-800 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-14 pr-7 py-5 bg-white border border-stone-100 rounded-3xl outline-none text-stone-700 shadow-sm focus:ring-4 focus:ring-stone-400/5 transition-all font-medium"
          />
        </div>

        {loading ? (
          <div className="space-y-4">
             {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-20 bg-white border border-stone-100 rounded-2xl animate-pulse" />
             ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-32 bg-white border border-stone-100 rounded-[3rem] shadow-sm">
             <AiOutlineInbox className="mx-auto text-stone-200 mb-4" size={48} />
             <p className="text-stone-300 font-serif text-xl italic">"No users found."</p>
          </div>
        ) : (
          <div className="bg-white border border-stone-100 rounded-[2.5rem] overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-stone-50/50">
                  <th className="px-8 py-5 text-stone-400 font-bold uppercase tracking-wider text-[10px]">Customer</th>
                  <th className="px-8 py-5 text-stone-400 font-bold uppercase tracking-wider text-[10px]">Contact Info</th>
                  <th className="px-8 py-5 text-stone-400 font-bold uppercase tracking-wider text-[10px]">Joined Date</th>
                  <th className="px-8 py-5 text-stone-400 font-bold uppercase tracking-wider text-[10px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user._id} className="border-t border-stone-50 hover:bg-stone-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-stone-900 text-white rounded-xl flex items-center justify-center font-black text-sm">
                          {user.name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-stone-800 text-sm">{user.name}</p>
                          <p className="text-[10px] text-stone-400 font-bold uppercase tracking-tighter">{user.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-xs font-bold text-stone-600">{user.email}</p>
                      <p className="text-[10px] text-stone-400 font-medium">{user.phone || "No phone"}</p>
                    </td>
                    <td className="px-8 py-5 text-xs font-bold text-stone-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-5 text-right">
                       <button
                         onClick={() => fetchUserOrders(user)}
                         className="bg-stone-900 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl hover:bg-stone-800 transition-all active:scale-95 shadow-lg shadow-stone-900/10"
                       >
                         View History
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal for User Order History */}
        {selectedUser && (
           <div className="fixed inset-0 bg-stone-900/20 backdrop-blur-sm z-50 flex items-center justify-end p-0 md:p-6 animate-fade-in">
              <div className="bg-white w-full md:w-[28rem] h-full md:h-auto md:max-h-[90vh] md:rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-slide-left">
                 <div className="px-8 py-8 border-b border-stone-50 flex items-center justify-between bg-stone-900 text-white">
                    <div>
                       <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-1">Order History</p>
                       <h3 className="text-2xl font-serif font-bold tracking-tight">{selectedUser.name}</h3>
                    </div>
                    <button onClick={() => setSelectedUser(null)} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
                       <AiOutlineClose size={20} />
                    </button>
                 </div>

                 <div className="flex-1 overflow-y-auto p-8 bg-[#fcfaf8]">
                    {ordersLoading ? (
                       <div className="flex flex-col items-center justify-center py-20 text-stone-300">
                          <div className="w-12 h-12 border-4 border-stone-100 border-t-stone-900 rounded-full animate-spin mb-4"></div>
                          <p className="text-xs font-bold uppercase tracking-widest">Loading Purchases...</p>
                       </div>
                    ) : userOrders.length === 0 ? (
                       <div className="text-center py-20 bg-white border border-stone-100 rounded-[2rem] shadow-sm">
                          <AiOutlineInbox className="mx-auto text-stone-100 mb-4" size={48} />
                          <p className="text-stone-300 font-serif text-lg italic tracking-wide">No orders placed yet.</p>
                       </div>
                    ) : (
                       <div className="space-y-6">
                          {userOrders.map((order) => (
                             <div key={order._id} className="bg-white border border-stone-100 rounded-3xl p-6 shadow-sm">
                                <div className="flex justify-between items-start mb-4 pb-4 border-b border-stone-50">
                                   <div>
                                      <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-0.5">#{order._id.slice(-8).toUpperCase()}</p>
                                      <p className="text-xs font-bold text-stone-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                                   </div>
                                   <div className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                                      order.status === "DELIVERED" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                                   }`}>
                                      {order.status}
                                   </div>
                                </div>
                                <div className="space-y-3">
                                   {order.items.map((item, idx) => (
                                      <div key={idx} className="flex justify-between items-center group">
                                         <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-stone-50 rounded-lg flex items-center justify-center text-stone-400 group-hover:bg-stone-100 transition-colors">
                                               <AiOutlineShopping size={16} />
                                            </div>
                                            <div>
                                               <p className="text-xs font-bold text-stone-800">{item.name}</p>
                                               <p className="text-[10px] text-stone-400 font-medium">Qty: {item.quantity}</p>
                                            </div>
                                         </div>
                                         <p className="text-xs font-black text-stone-900">₹{item.price * item.quantity}</p>
                                      </div>
                                   ))}
                                </div>
                                <div className="mt-4 pt-4 border-t border-stone-50 flex justify-between items-center">
                                   <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Grand Total</span>
                                   <span className="text-sm font-black text-stone-900 tracking-tighter">₹{order.totalAmount}</span>
                                </div>
                             </div>
                          ))}
                       </div>
                    )}
                 </div>
              </div>
           </div>
        )}
      </div>
    </div>
  );
}

export default ManageUsers;
