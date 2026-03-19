import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { AiOutlineArrowLeft, AiOutlineUserAdd, AiOutlineStop, AiOutlineCheckCircle } from "react-icons/ai";

function ManageDelivery() {
  const navigate = useNavigate();
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPartners = () => {
    api
      .get("/delivery")
      .then((res) => setPartners(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const toggleStatus = async (id) => {
    try {
      await api.put(`/delivery/${id}/toggle`);
      setPartners((prev) =>
        prev.map((p) => (p._id === id ? { ...p, isActive: !p.isActive } : p))
      );
    } catch {
      alert("Action failed.");
    }
  };

  return (
    <div className="bg-[#fdfcfb] min-h-screen py-10 px-6 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate("/")}
          className="text-stone-400 hover:text-stone-800 mb-8 flex items-center gap-2 font-bold text-xs tracking-widest transition-colors"
        >
          <AiOutlineArrowLeft /> BACK
        </button>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-serif font-bold text-stone-800">Manage Delivery Partners</h2>
            <p className="text-stone-400 text-xs font-bold uppercase tracking-widest mt-1">Manage delivery personnel</p>
          </div>
          <button
            onClick={() => navigate("/add-delivery")}
            className="flex items-center gap-2 bg-stone-900 text-white font-bold px-6 py-3.5 rounded-2xl hover:bg-stone-800 transition-all text-sm shadow-lg shadow-stone-100"
          >
            <AiOutlineUserAdd size={18} /> Add New Partner
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 bg-white border border-stone-100 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : partners.length === 0 ? (
          <div className="text-center py-24 bg-white border border-stone-100 rounded-[3rem] shadow-sm">
            <p className="text-stone-300 font-serif text-lg italic">"No delivery partners added yet."</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {partners.map((p) => (
              <div
                key={p._id}
                className="bg-white border border-stone-100 rounded-[2rem] p-6 flex items-center gap-5 shadow-sm hover:shadow-md transition-all group border-l-4 border-l-stone-100"
              >
                {/* Avatar */}
                <div className="w-14 h-14 bg-stone-50 rounded-2xl flex items-center justify-center text-stone-800 font-bold text-xl group-hover:bg-stone-900 group-hover:text-white transition-colors">
                  {p.name[0].toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-stone-800 truncate text-lg leading-tight">{p.name}</h3>
                  <p className="text-xs text-stone-400 font-medium">{p.email}</p>
                  <p className="text-xs text-stone-400 font-medium mb-1.5">{p.phone || "No phone added"}</p>
                  
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                      p.isActive ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-red-50 text-red-500 border border-red-100"
                    }`}>
                      {p.isActive ? "Active" : "Disabled"}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <button
                  onClick={() => toggleStatus(p._id)}
                  title={p.isActive ? "Disable Account" : "Enable Account"}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all active:scale-90 ${
                    p.isActive ? "bg-red-50 text-red-500 hover:bg-red-100" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                  }`}
                >
                  {p.isActive ? <AiOutlineStop size={20} /> : <AiOutlineCheckCircle size={20} />}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageDelivery;
