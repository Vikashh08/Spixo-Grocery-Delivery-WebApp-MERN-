import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { 
  AiOutlineLock, 
  AiOutlineEye, 
  AiOutlineEyeInvisible,
  AiOutlineArrowRight,
  AiOutlineLoading,
  AiOutlineCheckCircle,
  AiOutlineUnlock
} from "react-icons/ai";
import toast from "react-hot-toast";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { token, password });
      toast.success("Password updated successfully!");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password. Link might be expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#fdfcfb] font-sans overflow-hidden">
      {/* Visual Side */}
      <div className="hidden lg:flex lg:w-3/5 bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600 relative overflow-hidden flex-col justify-between p-16 animate-fade-in">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl animate-pulse"></div>
        
        <div className="relative z-10 flex items-center gap-4 animate-slide-up">
           <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-[1.5rem] flex items-center justify-center border border-white/30 shadow-2xl">
              <span className="text-white text-3xl font-black italic">S</span>
           </div>
           <div>
             <span className="text-4xl font-black text-white tracking-tight">Spixo</span>
             <p className="text-emerald-100/60 text-[10px] font-black uppercase tracking-[0.2em] mt-1 ml-1">Hyperlocal Grocery</p>
           </div>
        </div>

        <div className="relative z-10 space-y-6 animate-slide-up delay-100">
          <h1 className="text-6xl font-black text-white leading-[1.1] tracking-tight">
            New password, <br /> 
            fresh <br />
            <span className="text-emerald-200">beginnings.</span>
          </h1>
          <p className="text-emerald-50/70 text-lg font-medium max-w-md">
            Almost there! Create a new strong password for your account to get back to shopping.
          </p>
        </div>

        <div className="relative z-10 p-8 bg-emerald-700/30 backdrop-blur-lg rounded-[2.5rem] border border-white/10 max-w-xs animate-slide-up delay-200">
           <AiOutlineUnlock className="text-emerald-200 mb-3" size={32} />
           <p className="text-white text-sm font-bold">Fast & Secure</p>
           <p className="text-emerald-100/60 text-[10px] font-bold uppercase tracking-wider mt-1">
             Your security is our priority. We use industry-standard encryption.
           </p>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-8 animate-scale-in">
        <div className="w-full max-w-md">
           <div className="mb-10 animate-slide-up">
             <h2 className="text-4xl font-black text-slate-900 tracking-tight">Reset Password</h2>
             <p className="text-slate-400 font-medium mt-2">Pick something memorable and secure</p>
           </div>

           {error && (
             <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 mb-6 animate-shake">
                <AiOutlineCheckCircle className="rotate-180" size={20} />
                <span className="text-sm font-bold">{error}</span>
             </div>
           )}

           <form onSubmit={handleSubmit} className="space-y-6 animate-slide-up delay-100">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">New Secret Password</label>
                <div className="relative group">
                  <AiOutlineLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full pl-12 pr-12 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all text-slate-700 font-medium placeholder:text-slate-300"
                    required
                    minLength={6}
                    autoComplete="off"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                  </button>
                </div>
                {password.length > 0 && (
                    <div className="flex gap-1.5 mt-2 px-1">
                      {[1,2,3,4].map(i => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${password.length >= i*2 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 'bg-slate-100'}`}></div>
                      ))}
                    </div>
                  )}
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-emerald-600 transition-all active:scale-95 disabled:opacity-70 disabled:pointer-events-none mt-2 flex items-center justify-center gap-3"
              >
                {loading ? <AiOutlineLoading className="animate-spin" size={18} /> : <>Save Password <AiOutlineArrowRight size={16} /></>}
              </button>
           </form>

           <div className="mt-10 text-center">
             <Link to="/login" className="text-sm font-bold text-slate-400 hover:text-emerald-600 transition-colors">
               Suddenly remembered? <span className="text-slate-900 border-b-2 border-slate-100 hover:border-emerald-600 pb-0.5">Let me log in</span>
             </Link>
           </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
