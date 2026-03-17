import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { AiOutlineArrowLeft, AiOutlineSetting, AiOutlineSave, AiOutlineNodeIndex } from "react-icons/ai";

function Settings() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    deliveryRadius: "",
    deliveryCharge: "",
    freeDeliveryThreshold: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    api
      .get("/admin/settings")
      .then((res) => {
        setForm({
          deliveryRadius: res.data.deliveryRadius ?? "",
          deliveryCharge: res.data.deliveryCharge ?? "",
          freeDeliveryThreshold: res.data.freeDeliveryThreshold ?? "",
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await api.put("/admin/settings", {
        deliveryRadius: parseFloat(form.deliveryRadius),
        deliveryCharge: parseFloat(form.deliveryCharge),
        freeDeliveryThreshold: parseFloat(form.freeDeliveryThreshold),
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      alert("Failed to save configuration.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-[#fcfaf8] min-h-screen py-12 px-6 font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* Navigation */}
        <button
          onClick={() => navigate("/")}
          className="text-stone-400 hover:text-stone-800 mb-8 flex items-center gap-2 font-bold text-xs tracking-widest transition-colors uppercase"
        >
          <AiOutlineArrowLeft /> ADMIN DASHBOARD
        </button>

        <div className="bg-white border border-stone-100 rounded-[3rem] shadow-2xl relative overflow-hidden">
          {/* Header */}
          <div className="bg-stone-900 px-10 py-12 text-white relative">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
             <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                   <AiOutlineSetting size={24} />
                </div>
                <div>
                   <h2 className="text-3xl font-serif font-bold tracking-tight">Store Settings</h2>
                   <p className="text-stone-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Manage your delivery settings</p>
                </div>
             </div>
          </div>

          {loading ? (
             <div className="p-12 space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-stone-50 rounded-2xl animate-pulse" />
                ))}
             </div>
          ) : (
            <form onSubmit={save} className="p-10 md:p-14 space-y-10">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Delivery Radius */}
                <div className="group">
                  <div className="flex items-center gap-2 mb-3">
                     <AiOutlineNodeIndex className="text-stone-400 group-focus-within:text-stone-900 transition-colors" />
                     <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest group-focus-within:text-stone-800 transition-colors">Delivery Radius (KM) *</label>
                  </div>
                  <input
                    name="deliveryRadius"
                    type="number"
                    min="0"
                    step="0.1"
                    value={form.deliveryRadius}
                    onChange={handleChange}
                    placeholder="e.g. 8.5"
                    required
                    className="w-full px-6 py-4 bg-stone-50 border border-stone-50 rounded-2xl outline-none text-stone-800 font-bold focus:bg-white focus:border-stone-200 focus:ring-4 focus:ring-stone-400/5 transition-all lg:text-lg"
                  />
                  <p className="text-[10px] text-stone-400 font-medium mt-2 leading-relaxed">Maximum distance for deliveries.</p>
                </div>

                {/* Base Charge */}
                <div className="group">
                  <div className="flex items-center gap-2 mb-3">
                     <span className="text-stone-400 group-focus-within:text-stone-900 transition-colors">₹</span>
                     <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest group-focus-within:text-stone-800 transition-colors">Delivery Fee (₹) *</label>
                  </div>
                  <input
                    name="deliveryCharge"
                    type="number"
                    min="0"
                    step="1"
                    value={form.deliveryCharge}
                    onChange={handleChange}
                    placeholder="e.g. 40"
                    required
                    className="w-full px-6 py-4 bg-stone-50 border border-stone-50 rounded-2xl outline-none text-stone-800 font-bold focus:bg-white focus:border-stone-200 focus:ring-4 focus:ring-stone-400/5 transition-all lg:text-lg"
                  />
                  <p className="text-[10px] text-stone-400 font-medium mt-2 leading-relaxed">Default delivery fee charged to customers.</p>
                </div>
              </div>

              {/* Free Threshold */}
              <div className="bg-emerald-50/50 rounded-[2rem] p-8 border border-emerald-50 group">
                <div className="flex items-center gap-2 mb-4">
                   <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center text-white text-xs font-black shadow-lg shadow-emerald-500/20">%</div>
                   <label className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Free Delivery Over (₹) *</label>
                </div>
                <input
                  name="freeDeliveryThreshold"
                  type="number"
                  min="0"
                  step="10"
                  value={form.freeDeliveryThreshold}
                  onChange={handleChange}
                  placeholder="e.g. 499"
                  required
                  className="w-full px-8 py-5 bg-white border border-emerald-100 rounded-2xl outline-none text-emerald-900 font-black focus:ring-8 focus:ring-emerald-500/5 transition-all text-xl"
                />
                <p className="text-[10px] text-emerald-700/60 font-medium mt-3 leading-relaxed italic">"Encourage larger orders by offering free delivery above this amount."</p>
              </div>

              {success && (
                <div className="bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-6 py-4 rounded-2xl border border-emerald-600 flex items-center gap-3 animate-bounce shadow-xl shadow-emerald-500/20">
                   <AiOutlineSave size={16} /> Configuration Saved Successfully
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                 <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-5 bg-stone-900 text-white font-black text-xs uppercase tracking-widest rounded-3xl hover:bg-stone-800 transition-all shadow-xl shadow-stone-200 disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2"
                  >
                    {saving ? "Saving..." : <><AiOutlineSave size={16} /> Save Settings</>}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="px-10 py-5 bg-white text-stone-400 font-bold text-xs uppercase tracking-widest rounded-3xl border border-stone-100 hover:text-stone-800 transition-all active:scale-95"
                  >
                    Cancel
                  </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;
