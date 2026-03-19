import React, { useEffect, useState } from "react";
import api from "../api/api";
import { AiOutlineMail, AiOutlineClockCircle, AiOutlineCheckCircle, AiOutlineFlag, AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

function SupportMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMessages();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/contact/${id}`, { status });
      setMessages(messages.map(m => m._id === id ? { ...m, status } : m));
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  return (
    <div className="bg-[#F8F9FB] min-h-screen font-sans p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-stone-400 hover:text-stone-900 font-black text-[10px] uppercase tracking-widest mb-8 transition-all">
          <AiOutlineArrowLeft /> Back to Dashboard
        </button>

        <header className="mb-12">
          <h1 className="text-4xl font-black text-stone-900 tracking-tight mb-2">Support Inquiries</h1>
          <p className="text-stone-400 font-bold text-xs uppercase tracking-widest">Management Console</p>
        </header>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-40 bg-white rounded-[2.5rem] animate-pulse border border-stone-100" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {messages.map((msg) => (
              <div key={msg._id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-stone-100 hover:shadow-xl transition-all group relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 opacity-[0.03] -mr-8 -mt-8 rotate-12 group-hover:scale-125 transition-transform duration-700`}>
                   <AiOutlineMail size={120} />
                </div>
                
                <div className="flex flex-col md:flex-row justify-between gap-8 relative z-10">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                        msg.status === 'PENDING' ? 'bg-amber-50 text-amber-600' : 
                        msg.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-600' : 
                        'bg-rose-50 text-rose-600'
                      }`}>
                        {msg.status}
                      </span>
                      <span className="text-stone-200 text-xs">•</span>
                      <span className="text-stone-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                        <AiOutlineClockCircle /> {new Date(msg.createdAt).toLocaleString()}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-black text-stone-900 mb-1">{msg.name}</h3>
                    <p className="text-indigo-600 text-xs font-bold mb-6 tracking-wide underline underline-offset-4 decoration-indigo-100">{msg.email}</p>
                    
                    <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100 relative">
                       <p className="text-stone-600 text-sm leading-relaxed font-medium">"{msg.message}"</p>
                       <div className="absolute -top-3 left-6 px-3 py-1 bg-stone-900 text-white rounded-lg text-[8px] font-black uppercase tracking-widest">
                          Reason: {msg.reason}
                       </div>
                    </div>
                  </div>

                  <div className="flex md:flex-cols gap-3 justify-end items-center">
                    {msg.status === 'PENDING' && (
                      <>
                        <button 
                          onClick={() => updateStatus(msg._id, 'RESOLVED')}
                          className="flex items-center justify-center gap-2 px-6 py-4 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-95 shadow-lg shadow-emerald-100"
                        >
                          <AiOutlineCheckCircle size={16} /> Resolve
                        </button>
                        <button 
                          onClick={() => updateStatus(msg._id, 'SPAM')}
                          className="flex items-center justify-center gap-2 px-6 py-4 bg-stone-100 text-stone-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 hover:text-rose-600 transition-all active:scale-95"
                        >
                          <AiOutlineFlag size={16} /> Mark Spam
                        </button>
                      </>
                    )}
                    {msg.status !== 'PENDING' && (
                       <span className="text-stone-300 font-black text-[9px] uppercase tracking-widest px-4 py-2 border border-stone-100 rounded-xl">Processed</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-stone-100">
                 <p className="text-stone-300 font-bold uppercase tracking-widest text-sm italic">"All clear. No pending inquiries."</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SupportMessages;
