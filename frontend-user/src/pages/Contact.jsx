import { useState } from "react";
import {
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineMessage,
  AiOutlineArrowRight,
} from "react-icons/ai";
import api from "../api/api";
import toast from "react-hot-toast";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    reason: "Order Issue",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [startY, setStartY] = useState(null);
  const [confetti, setConfetti] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/contact", formData);
      setSubmitted(true);
      setConfetti(true);
      toast.success("Support request sent");

      setFormData({
        name: "",
        email: "",
        reason: "Order Issue",
        message: "",
      });
    } catch {
      toast.error("Failed to send request");
    } finally {
      setLoading(false);
    }
  };

  const handleTouchStart = (e) => setStartY(e.touches[0].clientY);

  const handleTouchMove = (e) => {
    if (!startY) return;
    if (e.touches[0].clientY - startY > 120) {
      setSubmitted(false);
      setConfetti(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f7f8fa] to-[#eef1f4] pt-24 pb-32 px-5 font-sans">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[320px_1fr] gap-14">
        
        {/* SIDEBAR */}
        <div className="lg:sticky lg:top-28 h-fit">
          <h2 className="text-[34px] font-extrabold text-gray-900 tracking-tight mb-3">
            Grocery Support
          </h2>

          <p className="text-gray-500 text-[15px] leading-relaxed mb-8">
            Delivery late? Items missing? Payment deducted?
            Our support team will resolve your issue quickly.
          </p>

          <div className="space-y-4">
            {[
              { icon: <AiOutlineMail />, title: "Email", value: "vikashwork6@gmail.com" },
              { icon: <AiOutlinePhone />, title: "Call", value: "+91 6204229636" },
              { icon: <AiOutlineMessage />, title: "Chat", value: "Available in App" },
            ].map((i, idx) => (
              <div
                key={idx}
                className="group bg-white border border-gray-100 p-5 rounded-2xl flex items-center gap-4
                shadow-[0_6px_20px_rgba(0,0,0,0.03)]
                hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)]
                hover:-translate-y-[2px] transition duration-300"
              >
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-700 group-hover:bg-gray-900 group-hover:text-white transition">
                  {i.icon}
                </div>

                <div>
                  <p className="text-[11px] text-gray-400 uppercase tracking-widest font-bold">
                    {i.title}
                  </p>
                  <p className="font-semibold text-gray-900 text-[15px]">
                    {i.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FORM CARD */}
        <div className="bg-white rounded-[28px] border border-gray-100
        shadow-[0_25px_70px_rgba(0,0,0,0.06)] p-10">
          
          <h3 className="text-2xl font-bold text-gray-900 mb-7">
            Raise Grocery Support Request
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              required
              placeholder="Full Name"
              value={formData.name}
              onChange={(e)=>setFormData({...formData,name:e.target.value})}
              className="w-full border border-gray-200 rounded-xl p-4 outline-none
              focus:ring-4 focus:ring-gray-100 focus:border-gray-400 transition"
            />

            <input
              required
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e)=>setFormData({...formData,email:e.target.value})}
              className="w-full border border-gray-200 rounded-xl p-4 outline-none
              focus:ring-4 focus:ring-gray-100 focus:border-gray-400 transition"
            />

            <select
              value={formData.reason}
              onChange={(e)=>setFormData({...formData,reason:e.target.value})}
              className="w-full border border-gray-200 rounded-xl p-4 outline-none"
            >
              <option>Order Issue</option>
              <option>Late Delivery</option>
              <option>Missing / Wrong Item</option>
              <option>Payment Problem</option>
              <option>Product Quality Issue</option>
            </select>

            <textarea
              required
              rows="4"
              placeholder="Describe your grocery issue..."
              value={formData.message}
              onChange={(e)=>setFormData({...formData,message:e.target.value})}
              className="w-full border border-gray-200 rounded-xl p-4 outline-none"
            />

            <button
              disabled={loading}
              className="w-full bg-gray-900 text-white py-4 rounded-xl font-semibold
              hover:bg-black active:scale-[0.97] transition flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Submit Request <AiOutlineArrowRight />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* SUCCESS SHEET */}
      {submitted && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end justify-center z-50">
          <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            className="bg-white w-full max-w-md rounded-t-3xl p-8 animate-sheet relative"
          >
            <div className="w-16 h-1 bg-gray-200 rounded-full mx-auto mb-6"></div>

            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5 animate-success">
              ✔
            </div>

            <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
              Request Sent Successfully
            </h3>

            <p className="text-gray-500 text-center mb-6">
              Our support team will contact you shortly.
            </p>

            <button
              onClick={()=>{setSubmitted(false);setConfetti(false);}}
              className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold"
            >
              Done
            </button>

            {confetti && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(20)].map((_,i)=>(
                  <div
                    key={i}
                    className="confetti"
                    style={{
                      left:Math.random()*100+"%",
                      animationDelay:i*0.05+"s"
                    }}
                  ></div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .animate-sheet{animation:sheet .5s cubic-bezier(.22,1.3,.36,1)}
        @keyframes sheet{
          0%{transform:translateY(100%)}
          60%{transform:translateY(-10px)}
          100%{transform:translateY(0)}
        }
        .animate-success{animation:pop .4s ease}
        @keyframes pop{
          0%{transform:scale(.6);opacity:0}
          80%{transform:scale(1.1)}
          100%{transform:scale(1)}
        }
        .confetti{
          position:absolute;
          top:-10px;
          width:8px;height:14px;
          background:#22c55e;
          animation:fall 1.2s linear forwards;
        }
        @keyframes fall{
          to{transform:translateY(240px) rotate(360deg);opacity:0}
        }
      `}</style>
    </div>
  );
}

export default Contact;