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
              <div className="text-center py-20 flex flex-col items-center justify-center space-y-6">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center animate-bounce shadow-inner">
                   <AiOutlineCheckCircle size={40} />
                </div>
                <h3 className="text-3xl font-serif font-black text-stone-900 tracking-tight">Message Received!</h3>
                <p className="text-stone-400 text-sm font-medium max-w-xs mx-auto italic">
                  One of our hyperlocal agents will review your inquiry and reach out via your registered email.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="bg-stone-900 text-white px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl active:scale-95"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <>
                <div className="mb-10">
                  <h3 className="text-2xl font-serif font-black text-stone-900 tracking-tight mb-2">Send a message</h3>
                  <div className="w-12 h-1 bg-stone-900 rounded-full"></div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Full Name</label>
                       <input 
                         required
                         type="text" 
                         value={formData.name}
                         onChange={(e) => setFormData({...formData, name: e.target.value})}
                         className="w-full bg-stone-50 border border-stone-100 px-6 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-stone-400/5 transition-all font-medium text-stone-700 placeholder-stone-300" 
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Email Address</label>
                       <input 
                         required
                         type="email" 
                         value={formData.email}
                         onChange={(e) => setFormData({...formData, email: e.target.value})}
                         className="w-full bg-stone-50 border border-stone-100 px-6 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-stone-400/5 transition-all font-medium text-stone-700 placeholder-stone-300" 
                       />
                    </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Reason for contact</label>
                     <select 
                       value={formData.reason}
                       onChange={(e) => setFormData({...formData, reason: e.target.value})}
                       className="w-full bg-stone-50 border border-stone-100 px-6 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-stone-400/5 transition-all font-bold text-stone-700 appearance-none cursor-pointer"
                     >
                        <option>Order Inquiry</option>
                        <option>Delivery Feedback</option>
                        <option>Product Suggestion</option>
                        <option>Technical Issue</option>
                        <option>Business Partnership</option>
                     </select>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Message Detail</label>
                     <textarea 
                       required
                       rows="4"
                       value={formData.message}
                       onChange={(e) => setFormData({...formData, message: e.target.value})}
                       className="w-full bg-stone-50 border border-stone-100 px-6 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-stone-400/5 transition-all font-medium text-stone-700 placeholder-stone-300 resize-none"
                     ></textarea>
                  </div>

                  <button 
                    disabled={loading}
                    type="submit"
                    className="w-full bg-stone-900 text-white p-5 rounded-[2rem] font-black text-[11px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Dispatch Message
                        <AiOutlineArrowRight />
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
