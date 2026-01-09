import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { AiOutlineArrowLeft } from "react-icons/ai";

function AddDelivery() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      // Correct Path: /api/delivery/create
      await api.post("/delivery/create", form); 
      alert("Fleet partner onboarded successfully.");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Onboarding failed.");
    }
  };

  return (
    <div className="bg-[#fdfcfb] min-h-screen py-12 px-6">
      <div className="max-w-2xl mx-auto bg-white border border-stone-100 rounded-[3rem] p-10 md:p-14 shadow-xl relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-stone-800"></div>
        <button onClick={() => navigate("/")} className="text-stone-400 hover:text-stone-800 mb-8 flex items-center gap-2 font-bold text-xs tracking-widest">
          <AiOutlineArrowLeft /> BACK
        </button>
        <h2 className="text-3xl font-serif font-bold text-stone-800 mb-10">Onboard Partner</h2>
        <form onSubmit={submit} className="space-y-6">
          <input name="name" placeholder="Partner Name" onChange={handleChange} className="w-full px-6 py-4 bg-stone-50 rounded-2xl outline-none" required />
          <input name="email" type="email" placeholder="Email" onChange={handleChange} className="w-full px-6 py-4 bg-stone-50 rounded-2xl outline-none" required />
          <input name="phone" placeholder="Phone" onChange={handleChange} className="w-full px-6 py-4 bg-stone-50 rounded-2xl outline-none" required />
          <input name="password" type="password" placeholder="Temporary Key" onChange={handleChange} className="w-full px-6 py-4 bg-stone-50 rounded-2xl outline-none" required />
          <button type="submit" className="w-full py-5 bg-stone-900 text-white font-bold rounded-2xl hover:bg-stone-800 transition-all">Generate Account</button>
        </form>
      </div>
    </div>
  );
}

export default AddDelivery;