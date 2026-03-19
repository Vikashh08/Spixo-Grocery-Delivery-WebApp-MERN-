import { useEffect, useState } from "react";

const QUOTES = [
  "Sourcing the morning's finest harvest...",
  "Verifying freshness at the source...",
  "Preparing your express dispatch layer...",
  "Curating essential goodness for you...",
  "Mapping the fastest route to your door...",
  "Quality check in progress...",
  "Almost there, fresh and ethical..."
];

function Loader() {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#fcfaf8]/80 backdrop-blur-2xl z-[9999] flex flex-col items-center justify-center p-8 animate-fade-in">
      <div className="relative w-20 h-20 mb-12">
        <div className="absolute inset-0 border-4 border-stone-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-stone-900 rounded-full border-t-transparent animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-stone-900"><path d="M12 2L3 7v10l9 5 9-5V7l-9-5Z"/><path d="m3 7 9 5 9-5"/><path d="M12 22V12"/></svg>
        </div>
      </div>
      
      <div className="text-center max-w-xs animate-slide-up">
        <p className="text-stone-900 font-serif font-bold text-xl mb-3 tracking-tight">Spixo Freshness</p>
        <p className="text-stone-400 font-medium italic text-sm leading-relaxed">"{quote}"</p>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3">
        <span className="w-1.5 h-1.5 rounded-full bg-stone-900 animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-1.5 h-1.5 rounded-full bg-stone-900 animate-bounce [animation-delay:-0.15s]"></span>
        <span className="w-1.5 h-1.5 rounded-full bg-stone-900 animate-bounce"></span>
      </div>
    </div>
  );
}

export default Loader;
