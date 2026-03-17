import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext.jsx";
import { 
  AiOutlineMail, 
  AiOutlineLock, 
  AiOutlineUser, 
  AiOutlinePhone,
  AiOutlineEye, 
  AiOutlineEyeInvisible,
  AiOutlineArrowRight,
  AiOutlineArrowLeft,
  AiOutlineLoading,
  AiOutlineCheckCircle
} from "react-icons/ai";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/register", form);
      login(res.data.token, res.data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const goNext = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setStep(2);
  };

  return (
    <div className="min-h-screen flex bg-white font-sans overflow-hidden">
      {/* Left Panel — Brand Visuals (Matched with Login) */}
      <div className="hidden lg:flex lg:w-3/5 bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600 relative overflow-hidden flex-col justify-between p-16 animate-fade-in">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/20 rounded-full -ml-32 -mb-32 blur-2xl"></div>
        
        <div className="relative z-10 flex items-center gap-4 animate-slide-up">
           <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-[1.5rem] flex items-center justify-center border border-white/30 shadow-2xl">
              <span className="text-white text-3xl font-black italic">S</span>
           </div>
           <div>
             <span className="text-4xl font-black text-white tracking-tight">Spixo</span>
             <p className="text-emerald-100/60 text-[10px] font-black uppercase tracking-[0.2em] mt-1 ml-1">Hyperlocal Grocery</p>
           </div>
        </div>

        <div className="relative z-10 space-y-8 animate-slide-up delay-100">
          <h1 className="text-6xl font-black text-white leading-[1.1] tracking-tight">
            Start your <br /> 
            journey on <br />
            <span className="text-emerald-200">a fresh path.</span>
          </h1>
          
          <div className="space-y-4">
            {[
              { icon: "⚡", title: "Only for you", desc: "We'll be at your door in 10 minutes." },
              { icon: "🌿", title: "Handpicked", desc: "Farm-fresh produce every single day." },
              { icon: "🛡️", title: "We're here", desc: "Easy returns if you aren't satisfied." }
            ].map((perk, i) => (
              <div key={i} className="flex items-center gap-4 bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10 w-fit">
                <span className="text-2xl">{perk.icon}</span>
                <div>
                  <p className="text-white text-sm font-bold">{perk.title}</p>
                  <p className="text-emerald-100/60 text-[10px] font-bold uppercase tracking-wider">{perk.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-6 animate-slide-up delay-200">
           <div className="flex -space-x-4">
              {[1,2,3,4].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-emerald-500 bg-emerald-400 shadow-lg"></div>)}
           </div>
           <p className="text-white text-sm font-bold">Join 10,000+ happy shoppers</p>
        </div>
      </div>

      {/* Right Panel — Registration Form */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-8 bg-[#fdfcfb] animate-scale-in">
        <div className="w-full max-w-md">
           <div className="lg:hidden flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-bold italic">S</span>
              </div>
              <span className="text-2xl font-black text-slate-800">Spixo</span>
           </div>

           {/* Step Indicator */}
           <div className="flex items-center gap-3 mb-8 px-1">
              <div className={`h-1.5 flex-1 rounded-full transition-all ${step >= 1 ? 'bg-emerald-500' : 'bg-slate-100'}`}></div>
              <div className={`h-1.5 flex-1 rounded-full transition-all ${step >= 2 ? 'bg-emerald-500' : 'bg-slate-100'}`}></div>
           </div>

           <div className="mb-10 animate-slide-up">
             <h2 className="text-4xl font-black text-slate-900 tracking-tight">
               {step === 1 ? "Nice to meet you!" : "Almost there!"}
             </h2>
             <p className="text-slate-400 font-medium mt-2">
               {step === 1 ? "Let's get you set up with a fresh Spixo account" : "Choose a secure password to protect your account"}
             </p>
           </div>

           {error && (
             <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 mb-6 transition-all">
                <AiOutlineCheckCircle className="rotate-180" size={20} />
                <span className="text-sm font-bold">{error}</span>
             </div>
           )}

           {step === 1 ? (
             <form onSubmit={goNext} className="space-y-6 animate-slide-up delay-100">
               <div className="space-y-2">
                 <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">What should we call you?</label>
                 <div className="relative group">
                   <AiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                   <input 
                     type="text" 
                     name="name"
                     value={form.name}
                     onChange={handleChange}
                     placeholder="Enter your full name"
                     className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all text-slate-700 font-medium placeholder:text-slate-300"
                     required
                     autoComplete="off"
                   />
                 </div>
               </div>

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
                 <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Can we have your phone number? <span className="text-slate-200 font-bold">(Optional)</span></label>
                 <div className="relative group">
                   <AiOutlinePhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                   <input 
                     type="tel" 
                     name="phone"
                     value={form.phone}
                     onChange={handleChange}
                     placeholder="+91 98765 43210"
                     className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all text-slate-700 font-medium placeholder:text-slate-300"
                     autoComplete="off"
                   />
                 </div>
               </div>

               <button 
                 type="submit" 
                 className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-emerald-600 transition-all active:scale-95 mt-2 flex items-center justify-center gap-3"
               >
                 Next step <AiOutlineArrowRight size={16} />
               </button>
             </form>
           ) : (
             <form onSubmit={handleSubmit} className="space-y-6 animate-slide-up">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Choose a secret password</label>
                  <div className="relative group">
                    <AiOutlineLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                    <input 
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
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
                  {form.password.length > 0 && (
                    <div className="flex gap-1.5 mt-2 px-1">
                      {[1,2,3,4].map(i => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${form.password.length >= i*2 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 'bg-slate-100'}`}></div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-5 bg-slate-50 border border-slate-100 rounded-[2rem] space-y-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Registering as</p>
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-black">
                        {form.name[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{form.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold">{form.email}</p>
                      </div>
                      <button type="button" onClick={() => setStep(1)} className="ml-auto p-2 text-slate-400 hover:text-emerald-600 transition-all">
                        <AiOutlineArrowLeft size={18} />
                      </button>
                   </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-emerald-600 transition-all active:scale-95 disabled:opacity-70 disabled:pointer-events-none mt-2 flex items-center justify-center gap-3"
                >
                  {loading ? <AiOutlineLoading className="animate-spin" size={18} /> : <>Complete Signup <AiOutlineCheckCircle size={18} /></>}
                </button>
             </form>
           )}

           <p className="text-center mt-10 text-slate-400 font-medium text-sm">
             Already have an account? <Link to="/login" className="text-emerald-600 font-black hover:underline ml-1">Sign In</Link>
           </p>
        </div>
      </div>
    </div>
  );
}

export default Register;