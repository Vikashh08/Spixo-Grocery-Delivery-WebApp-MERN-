import { useNavigate } from "react-router-dom";
import { AiOutlineCheckCircle, AiOutlineShopping, AiOutlineArrowRight } from "react-icons/ai";
import { useEffect } from "react";

function OrderSuccess() {
  const navigate = useNavigate();

  // Optional: Redirect home if they try to access this page without a recent order
  // For now, we'll keep it simple so you can verify the fix.

  return (
    <div className="bg-[#fdfcfb] min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center bg-white p-12 rounded-[3rem] border border-stone-100 shadow-sm">
        
        {/* Animated Success Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 animate-bounce">
            <AiOutlineCheckCircle size={48} />
          </div>
        </div>

        <h1 className="text-4xl font-serif font-bold text-stone-800 mb-4 tracking-tight">
          Order Placed!
        </h1>
        <p className="text-stone-500 font-medium leading-relaxed mb-10">
          We’ve received your order. Our team is hand-picking your items right now. 
          You can track the progress in your orders tab.
        </p>

        <div className="space-y-4">
          <button
            onClick={() => navigate("/orders")}
            className="w-full py-5 bg-stone-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-stone-800 transition-all shadow-xl shadow-stone-100 active:scale-95"
          >
            VIEW MY ORDERS
          </button>
          
          <button
            onClick={() => navigate("/products")}
            className="w-full py-5 bg-white border border-stone-100 text-stone-400 font-bold rounded-2xl flex items-center justify-center gap-3 hover:text-stone-800 transition-all active:scale-95"
          >
            CONTINUE SHOPPING <AiOutlineArrowRight />
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-stone-50">
           <p className="text-[10px] text-stone-300 font-bold uppercase tracking-[0.2em]">
            Boutique Logistics Enabled
          </p>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;