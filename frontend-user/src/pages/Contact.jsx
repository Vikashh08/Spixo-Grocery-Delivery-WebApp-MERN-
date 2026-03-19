import { useState } from "react";
import { AiOutlineMail, AiOutlinePhone, AiOutlineMessage, AiOutlineArrowRight, AiOutlineCheckCircle } from "react-icons/ai";
import api from "../api/api";
import toast from "react-hot-toast";

function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", reason: "Order Inquiry", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/contact", formData);
      setSubmitted(true);
      setFormData({ name: "", email: "", reason: "Order Inquiry", message: "" });
      toast.success("Message sent successfully!");
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#fcfaf8] min-h-screen pt-32 pb-24 px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Info & Support Cards */}
          <div className="lg:col-span-5 space-y-12">
            <div>
              <h2 className="text-5xl font-serif font-black text-stone-900 tracking-tighter mb-4 animate-slide-up">
                We're here <br/> to help.
              </h2>
              <p className="text-stone-400 text-sm font-medium leading-relaxed max-w-sm animate-fade-in [animation-delay:0.2s]">
                Have a question about your order, delivery, or just want to say hi? Our team is available 24/7 to assist you.
              </p>
            </div>

            <div className="space-y-6 animate-fade-in [animation-delay:0.4s]">
              {[
                { icon: <AiOutlineMail />, title: "Email Support", value: "vikashwork6@gmail.com", desc: "Response within 12 hours" },
                { icon: <AiOutlinePhone />, title: "Direct Hub", value: "+91 6204229636", desc: "Mon-Sun, 9am - 10pm" },
                { icon: <AiOutlineMessage />, title: "Live Chat", value: "Available in App", desc: "Instant assistance" }
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-6 rounded-[2rem] border border-stone-100 flex items-center gap-6 shadow-sm hover:shadow-xl transition-all group">
                   <div className="w-14 h-14 bg-stone-50 rounded-2xl flex items-center justify-center text-stone-900 text-xl shadow-inner group-hover:bg-stone-900 group-hover:text-white transition-all">
                      {item.icon}
                   </div>
                   <div>
                      <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">{item.title}</h4>
                      <p className="text-stone-900 font-bold text-sm mb-0.5">{item.value}</p>
                      <p className="text-stone-400 text-[10px] font-medium">{item.desc}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-[3.5rem] p-8 md:p-12 shadow-2xl shadow-stone-200/50 border border-stone-100 relative overflow-hidden animate-fade-in [animation-delay:0.6s]">
            {submitted ? (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-2xl z-50 flex flex-col items-center justify-center p-12 animate-scale-in">
                {/* Floating Particles Animation */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                   {[...Array(15)].map((_, i) => (
                      <div 
                        key={i}
                        className="absolute w-2 h-2 bg-indigo-500/20 rounded-full animate-float-particle"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animationDelay: `${Math.random() * 5}s`,
                          animationDuration: `${4 + Math.random() * 4}s`
                        }}
                      />
                   ))}
                </div>

                <div className="relative mb-12 group">
                   <div className="absolute inset-0 bg-indigo-400/30 blur-3xl rounded-full animate-pulse group-hover:scale-150 transition-transform duration-1000"></div>
                   <div className="relative w-28 h-28 bg-gradient-to-br from-indigo-500 to-emerald-500 text-white rounded-[3rem] flex items-center justify-center shadow-2xl shadow-indigo-500/40 rotate-12 group-hover:rotate-0 transition-all duration-700">
                      <AiOutlineCheckCircle size={56} className="animate-wiggle" />
                   </div>
                </div>
                
                <div className="text-center space-y-4 mb-12">
                   <h3 className="text-4xl font-serif font-black text-stone-900 tracking-tighter leading-tight animate-slide-up">
                      Thank you for <br/> 
                      <span className="bg-gradient-to-r from-indigo-600 to-emerald-600 bg-clip-text text-transparent">contacting Spixo.</span>
                   </h3>
                   <p className="text-stone-400 text-[13px] font-bold uppercase tracking-[0.3em] animate-fade-in [animation-delay:0.4s]">
                      Message Dispatched Successfully
                   </p>
                </div>
                
                <p className="text-stone-500 text-sm font-medium max-w-sm text-center leading-relaxed mb-12 animate-fade-in [animation-delay:0.6s]">
                   We appreciate your outreach. A dedicated support specialist has been notified and will respond to your registered email shortly.
                </p>

                <div className="flex flex-col w-full gap-3 animate-fade-in [animation-delay:0.8s]">
                   <button 
                     onClick={() => setSubmitted(false)}
                     className="w-full bg-stone-900 text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:shadow-indigo-500/40 hover:bg-stone-800 transition-all active:scale-95 translate-y-0 hover:-translate-y-1"
                   >
                     Send Another Message
                   </button>
                   <button 
                     onClick={() => window.location.href = "/"}
                     className="w-full bg-white text-stone-400 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] border border-stone-100 hover:bg-stone-50 hover:text-stone-900 transition-all"
                   >
                     Back to Marketplace
                   </button>
                </div>
              </div>
            ) : (
              <div className="relative z-10">
                <div className="mb-10">
                  <div className="flex items-center gap-4 mb-2">
                     <h3 className="text-2xl font-serif font-black text-stone-900 tracking-tight">Send a message</h3>
                     <div className="h-px flex-1 bg-stone-100"></div>
                  </div>
                  <p className="text-stone-400 text-[10px] font-black uppercase tracking-[0.2em]">Our team will get back to you shortly</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1 text-indigo-600/60">Full Name</label>
                       <input 
                         required
                         type="text" 
                         value={formData.name}
                         onChange={(e) => setFormData({...formData, name: e.target.value})}
                         className="w-full bg-stone-50/50 border border-stone-100 px-6 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white transition-all font-medium text-stone-700" 
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1 text-indigo-600/60">Email Address</label>
                       <input 
                         required
                         type="email" 
                         value={formData.email}
                         onChange={(e) => setFormData({...formData, email: e.target.value})}
                         className="w-full bg-stone-50/50 border border-stone-100 px-6 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white transition-all font-medium text-stone-700" 
                       />
                    </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1 text-indigo-600/60">Reason for contact</label>
                     <div className="relative">
                        <select 
                          value={formData.reason}
                          onChange={(e) => setFormData({...formData, reason: e.target.value})}
                          className="w-full bg-stone-50/50 border border-stone-100 px-6 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white transition-all font-bold text-stone-700 appearance-none cursor-pointer"
                        >
                           <option>Order Inquiry</option>
                           <option>Delivery Feedback</option>
                           <option>Product Suggestion</option>
                           <option>Technical Issue</option>
                           <option>Business Partnership</option>
                        </select>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1 text-indigo-600/60">Message Detail</label>
                     <textarea 
                       required
                       rows="4"
                       value={formData.message}
                       onChange={(e) => setFormData({...formData, message: e.target.value})}
                       className="w-full bg-stone-50/50 border border-stone-100 px-6 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white transition-all font-medium text-stone-700 resize-none"
                     ></textarea>
                  </div>

                  <button 
                    disabled={loading}
                    type="submit"
                    className="w-full bg-gradient-to-r from-stone-900 to-stone-800 text-white p-5 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] hover:from-indigo-600 hover:to-emerald-600 transition-all duration-500 shadow-2xl active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Dispatch Message
                        <AiOutlineArrowRight className="animate-pulse" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
