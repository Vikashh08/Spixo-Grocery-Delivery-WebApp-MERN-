import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { AiOutlineUnlock, AiOutlineMail } from "react-icons/ai";

function DeliveryLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/delivery/login", { email, password }); 
      localStorage.setItem("deliveryToken", res.data.token);
      navigate("/orders");
    } catch {
      setError("Authentication failed. Check your security key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-950 px-6 font-sans">
      <div className="w-full max-w-md">
        <form onSubmit={handleLogin} className="bg-white rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>
          <div className="text-center mb-10 flex flex-col items-center">
            <img src="/logo.ico" alt="Spixo" className="w-16 h-16 mb-4 drop-shadow-xl" />
            <h2 className="text-3xl font-serif font-bold text-stone-800 tracking-tight">Fleet Access</h2>
            <p className="text-stone-400 mt-2 text-[10px] font-bold uppercase tracking-widest">Spixo Delivery Network</p>
          </div>

          {error && (
            <div className="mb-8 flex justify-center animate-shake">
              <div className="bg-white px-6 py-2.5 rounded-full border border-stone-100 shadow-[0_10px_40px_-10px_rgba(37,99,235,0.2)] flex items-center gap-3 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                <span className="text-[11px] font-black text-stone-800 uppercase tracking-widest">
                  Fleet Match Failed: Access Denied
                </span>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div className="relative">
              <AiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" />
              <input type="email" placeholder="Partner Email" onChange={(e) => setEmail(e.target.value)} className="w-full pl-12 pr-6 py-4 bg-stone-50 rounded-2xl outline-none" required />
            </div>
            <div className="relative">
              <AiOutlineUnlock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" />
              <input type="password" placeholder="Security Key" onChange={(e) => setPassword(e.target.value)} className="w-full pl-12 pr-6 py-4 bg-stone-50 rounded-2xl outline-none" required />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-5 bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : "START SHIFT"}
            </button>
          </div>

          <div className="mt-8 text-center">
             <p className="text-[10px] font-black text-blue-600 bg-blue-50 py-2 px-4 rounded-xl uppercase tracking-widest inline-block border border-blue-100">
                Contact Developer for User ID & Pass
             </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DeliveryLogin;