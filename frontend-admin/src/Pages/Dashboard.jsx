import { useNavigate, Link } from "react-router-dom";
import { AiOutlinePlusCircle, AiOutlineOrderedList, AiOutlineUserAdd, AiOutlineLogout } from "react-icons/ai";

function Dashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  const menuItems = [
    { title: "Inventory", desc: "Manage premium catalog", path: "/add-product", icon: <AiOutlinePlusCircle size={24} /> },
    { title: "Live Orders", desc: "Coordinate active fleet", path: "/orders", icon: <AiOutlineOrderedList size={24} /> },
    { title: "Fleet Onboarding", desc: "Add delivery partners", path: "/add-delivery", icon: <AiOutlineUserAdd size={24} /> }
  ];

  return (
    <div className="bg-[#fdfcfb] min-h-screen p-8 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-16">
          <div>
            <h1 className="text-4xl font-serif font-bold text-stone-800 tracking-tight">Dashboard</h1>
            <p className="text-stone-400 text-xs font-bold uppercase tracking-widest mt-1">System Status: Active</p>
          </div>
          <button onClick={logout} className="flex items-center gap-2 text-stone-400 hover:text-red-500 font-bold text-xs transition-all">
            <AiOutlineLogout size={18} /> LOGOUT
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {menuItems.map((item, index) => (
            <Link key={index} to={item.path} className="bg-white border border-stone-100 rounded-[2.5rem] p-10 hover:shadow-2xl transition-all group">
              <div className="w-12 h-12 bg-stone-900 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-800 mb-2">{item.title}</h3>
              <p className="text-stone-400 text-sm leading-relaxed">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;