import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";
import { 
  AiOutlineMail, 
  AiOutlineArrowRight,
  AiOutlineArrowLeft,
  AiOutlineLoading,
  AiOutlineCheckCircle,
  AiOutlineExclamationCircle
} from "react-icons/ai";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#fdfcfb] font-sans overflow-hidden">
      {/* Visual Side (Matched with Auth Theme) */}
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
            Don't worry, <br /> 
            we've got <br />
            <span className="text-emerald-200">your back.</span>
          </h1>
          <p className="text-emerald-50/70 text-lg font-medium max-w-md">
            Lost your key to freshness? No problem. Just let us know your email and we'll help you get back in.
          </p>
        </div>

        <div className="relative z-10 p-8 bg-emerald-700/30 backdrop-blur-lg rounded-[2.5rem] border border-white/10 max-w-xs animate-slide-up delay-200">
           <AiOutlineExclamationCircle className="text-emerald-200 mb-3" size={32} />
           <p className="text-white text-sm font-bold">Safety Tip</p>
           <p className="text-emerald-100/60 text-[10px] font-bold uppercase tracking-wider mt-1">
             Always use a unique password to keep your Spixo account secure.
           </p>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-8 animate-scale-in">
        <div className="w-full max-w-md">
           <Link to="/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-600 font-black text-[10px] uppercase tracking-widest mb-10 transition-colors group">
              <AiOutlineArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Sign In
           </Link>

           {success ? (
             <div className="text-center animate-slide-up">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/10">
                   <AiOutlineCheckCircle size={40} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-3">Check your inbox!</h2>
                <p className="text-slate-500 font-medium mb-8">
                  We've sent recovery instructions to <span className="text-slate-900 font-bold">{email}</span>. Please check your email to reset your password.
                </p>
                <Link to="/login" className="inline-block px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-emerald-600 transition-all active:scale-95">
                  Great, take me back
                </Link>
             </div>
           ) : (
             <>
               <div className="mb-10 animate-slide-up">
                 <h2 className="text-4xl font-black text-slate-900 tracking-tight">Forgot password?</h2>
                 <p className="text-slate-400 font-medium mt-2">Enter the email associated with your account</p>
               </div>

               {error && (
                 <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 mb-6 animate-shake">
                    <AiOutlineCheckCircle className="rotate-180" size={20} />
                    <span className="text-sm font-bold">{error}</span>
                 </div>
               )}

               <form onSubmit={handleSubmit} className="space-y-6 animate-slide-up delay-100">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">What's your email?</label>
                    <div className="relative group">
                      <AiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all text-slate-700 font-medium placeholder:text-slate-300"
                        required
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-emerald-600 transition-all active:scale-95 disabled:opacity-70 disabled:pointer-events-none mt-2 flex items-center justify-center gap-3"
                  >
                    {loading ? <AiOutlineLoading className="animate-spin" size={18} /> : <>Reset Password <AiOutlineArrowRight size={16} /></>}
                  </button>
               </form>
             </>
           )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
