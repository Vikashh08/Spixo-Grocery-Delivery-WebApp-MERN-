import React, { useEffect, useState } from "react";
import api from "../api/api";
import { AiOutlineClockCircle, AiOutlineMail, AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function MySupport() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyInquiries = async () => {
      try {
        const res = await api.get("/contact/my");
        setInquiries(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMyInquiries();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#fcfaf8] pt-32 pb-24 px-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif font-black text-stone-900 mb-4">Auth Required</h2>
          <p className="text-stone-400 mb-8">Please login to track your support inquiries.</p>
          <button onClick={() => navigate("/login")} className="bg-stone-900 text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px]">Login Now</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfaf8] min-h-screen pt-32 pb-24 px-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-stone-400 hover:text-stone-900 font-black text-[10px] uppercase tracking-widest mb-8 transition-all">
          <AiOutlineArrowLeft /> Back
        </button>

        <header className="mb-12">
          <h1 className="text-4xl font-serif font-black text-stone-900 tracking-tight mb-2">My Support Hub</h1>
          <p className="text-stone-400 font-bold text-[10px] uppercase tracking-[0.2em]">Track your inquiry status in real-time</p>
        </header>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-32 bg-white rounded-3xl animate-pulse border border-stone-100" />)}
          </div>
        ) : (
          <div className="space-y-6">
            {inquiries.map((msg) => (
              <div key={msg._id} className="bg-white rounded-3xl p-8 border border-stone-100 shadow-sm hover:shadow-xl transition-all group">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                        msg.status === 'PENDING' ? 'bg-amber-50 text-amber-600' : 
                        msg.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-600' : 
                        'bg-rose-50 text-rose-600'
                      }`}>
                        {msg.status}
                      </span>
                      <span className="text-stone-200 text-xs">•</span>
                      <span className="text-stone-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                        <AiOutlineClockCircle /> {new Date(msg.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-black text-stone-900 mb-1">{msg.reason}</h3>
                      <p className="text-stone-500 text-sm leading-relaxed max-w-lg">"{msg.message}"</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-center">
                    {msg.status === 'RESOLVED' ? (
                       <div className="text-emerald-500 flex flex-col items-end gap-1">
                          <span className="text-[10px] font-black uppercase tracking-widest">Inquiry Closed</span>
                          <p className="text-[9px] font-medium text-stone-400">Resolution Complete</p>
                       </div>
                    ) : (
                       <div className="text-stone-300 flex flex-col items-end gap-1">
                          <span className="text-[10px] font-black uppercase tracking-widest">Active Triage</span>
                          <p className="text-[9px] font-medium text-stone-400">In Queue for Specialist</p>
                       </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {inquiries.length === 0 && (
              <div className="text-center py-24 bg-white rounded-[3rem] border border-stone-100 italic">
                <p className="text-stone-300 font-bold uppercase tracking-widest text-xs">"You have no active support inquiries."</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MySupport;
