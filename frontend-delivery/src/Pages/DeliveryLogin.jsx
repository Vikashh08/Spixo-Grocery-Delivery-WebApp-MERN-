import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { AiOutlineUnlock, AiOutlineMail } from "react-icons/ai";

function DeliveryLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Hits /api/delivery/login
      const res = await api.post("/delivery/login", { email, password }); 
      localStorage.setItem("deliveryToken", res.data.token);
      navigate("/orders"); // Redirect to assigned tasks
    } catch {
      alert("Fleet authentication failed. Check credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-950 px-6 font-sans">
      <div className="w-full max-w-md">
        <form onSubmit={handleLogin} className="bg-white rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif font-bold text-stone-800 tracking-tight">Fleet Access</h2>
            <p className="text-stone-400 mt-2 text-[10px] font-bold uppercase tracking-widest">Spixo Delivery Network</p>
          </div>
          <div className="space-y-6">
            <div className="relative">
              <AiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" />
              <input type="email" placeholder="Partner Email" onChange={(e) => setEmail(e.target.value)} className="w-full pl-12 pr-6 py-4 bg-stone-50 rounded-2xl outline-none" required />
            </div>
            <div className="relative">
              <AiOutlineUnlock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" />
              <input type="password" placeholder="Security Key" onChange={(e) => setPassword(e.target.value)} className="w-full pl-12 pr-6 py-4 bg-stone-50 rounded-2xl outline-none" required />
            </div>
            <button type="submit" className="w-full py-5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all active:scale-95">START SHIFT</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DeliveryLogin;