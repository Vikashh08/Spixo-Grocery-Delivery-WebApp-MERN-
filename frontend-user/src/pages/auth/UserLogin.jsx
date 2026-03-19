import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext.jsx";
import { 
  AiOutlineMail, 
  AiOutlineLock, 
  AiOutlineEye, 
  AiOutlineEyeInvisible,
  AiOutlineArrowRight,
  AiOutlineCheckCircle,
  AiOutlineLoading
} from "react-icons/ai";

function UserLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      login(res.data.token, res.data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <div className="min-h-screen flex bg-white font-sans overflow-hidden">
      {/* Left Panel — Brand Visuals */}
      <div className="hidden lg:flex lg:w-3/5 bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600 relative overflow-hidden flex-col justify-between p-16 animate-fade-in">
        {/* Dynamic Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/20 rounded-full -ml-32 -mb-32 blur-2xl"></div>
        
        {/* Logo Section */}
        <div className="relative z-10 flex items-center gap-4 animate-slide-up">
           <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-[1.5rem] flex items-center justify-center border border-white/30 shadow-2xl">
              <span className="text-white text-3xl font-black italic">S</span>
           </div>
           <div>
             <span className="text-4xl font-black text-white tracking-tight">Spixo</span>
             <p className="text-emerald-100/60 text-[10px] font-black uppercase tracking-[0.2em] mt-1 ml-1">Hyperlocal Grocery</p>
           </div>
        </div>

        {/* Content Section */}
        <div className="relative z-10 space-y-8 animate-slide-up delay-100">
          <h1 className="text-6xl font-black text-white leading-[1.1] tracking-tight">
            Welcome to <br /> 
            the family. <br />
            <span className="text-emerald-200">We missed you.</span>
          </h1>
          
          <div className="flex gap-4">
            <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20">
              <p className="text-white text-sm font-bold italic">"Super fast!"</p>
              <p className="text-emerald-100 text-[10px] font-bold uppercase tracking-wider">Average Dispatch</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20">
              <p className="text-white text-sm font-bold italic">"Farm to fork"</p>
              <p className="text-emerald-100 text-[10px] font-bold uppercase tracking-wider">Quality Guarantee</p>
            </div>
          </div>
        </div>

        {/* Testimonial / Tagline */}
        <div className="relative z-10 p-8 bg-emerald-700/30 backdrop-blur-lg rounded-[2.5rem] border border-white/10 max-w-sm animate-slide-up delay-200">
          <div className="flex gap-1 mb-3">
             {[1,2,3,4,5].map(i => <span key={i} className="text-yellow-400 text-sm">★</span>)}
          </div>
          <p className="text-emerald-50 text-sm font-medium leading-relaxed italic">
            "Spixo has changed the way I shop. The produce is always incredibly fresh and arrives faster than I could drive to the store myself!"
          </p>
          <div className="flex items-center gap-3 mt-4">
             <div className="w-8 h-8 rounded-full bg-emerald-400"></div>
             <div>
               <p className="text-white text-xs font-bold">Sarah Jenkins</p>
               <p className="text-emerald-200 text-[10px] font-bold uppercase">Happy Customer</p>
             </div>
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-8 bg-[#fdfcfb] animate-scale-in">
        <div className="w-full max-w-md">
           {/* Mobile Branding */}
           <div className="lg:hidden flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-bold italic">S</span>
              </div>
              <span className="text-2xl font-black text-slate-800">Spixo</span>
           </div>

           <div className="mb-10 animate-slide-up">
             <h2 className="text-4xl font-black text-slate-900 tracking-tight">Welcome back!</h2>
             <p className="text-slate-400 font-medium mt-2">Ready to fill your cart with fresh goodness?</p>
           </div>

           {error && (
             <div className="mb-8 flex justify-center animate-shake">
               <div className="bg-white px-6 py-2.5 rounded-full border border-stone-100 shadow-[0_10px_40px_-10px_rgba(225,29,72,0.2)] flex items-center gap-3 relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-r from-rose-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                 <div className="w-2 h-2 bg-rose-600 rounded-full animate-pulse" />
                 <span className="text-[11px] font-black text-stone-800 uppercase tracking-widest">
                    Incorrect email or password
                 </span>
               </div>
             </div>
           )}

           <form onSubmit={handleLogin} className="space-y-6 animate-slide-up delay-100">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">What's your email address?</label>
                <div className="relative group">
                  <AiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                  <input 
                    type="email" 
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all text-slate-700 font-medium placeholder:text-slate-300"
                    required
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Enter your secret password</label>
                  <Link to="/forgot-password" size="sm" className="text-[10px] font-black text-slate-400 hover:text-emerald-600 transition-colors uppercase tracking-widest">Lost it?</Link>
                </div>
                <div className="relative group">
                  <AiOutlineLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                  <input 
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all text-slate-700 font-medium placeholder:text-slate-300"
                    required
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
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-emerald-600 transition-all active:scale-95 disabled:opacity-70 disabled:pointer-events-none mt-2 flex items-center justify-center gap-3"
              >
                {loading ? <AiOutlineLoading className="animate-spin" size={18} /> : <>Let's get started! <AiOutlineArrowRight size={16} /></>}
              </button>
           </form>

           <div className="relative flex items-center py-8">
              <div className="flex-grow border-t border-slate-100"></div>
              <span className="flex-medium flex-shrink mx-4 text-xs font-bold text-slate-300 uppercase tracking-widest">Or jump in with</span>
              <div className="flex-grow border-t border-slate-100"></div>
           </div>

           <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-4 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                <span className="text-sm">Quick Login with Google</span>
              </button>
           </div>

           <p className="text-center mt-10 text-slate-400 font-medium text-sm">
             New here? <Link to="/register" className="text-emerald-600 font-black hover:underline ml-1">Create an account</Link>
           </p>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;
