import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useSettings } from "../context/SettingsContext.jsx";

function Cart() {
  const { cartItems, addToCart, decreaseQty, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();
  const { settings } = useSettings();

  const deliveryCharge = totalAmount >= settings.freeDeliveryThreshold ? 0 : settings.deliveryCharge;
  const finalAmount = totalAmount + deliveryCharge;
  const freeDeliveryRemaining = Math.max(0, settings.freeDeliveryThreshold - totalAmount);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#fcfaf8] flex flex-col items-center justify-center px-6 text-center pt-24">
        <div className="w-32 h-32 bg-stone-100 rounded-[3rem] flex items-center justify-center mb-10 text-stone-300">
          <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
        </div>
        <h2 className="text-4xl font-serif font-bold text-stone-900 mb-4 tracking-tight">Your cart is waiting</h2>
        <p className="text-stone-400 mb-10 max-w-sm font-medium leading-relaxed italic">Handpick the freshest ingredients and they will appear here, ready for your kitchen.</p>
        <button
          onClick={() => navigate("/products")}
          className="bg-stone-900 text-white font-serif font-bold px-12 py-5 rounded-2xl hover:bg-green-500 transition-all active:scale-95 shadow-2xl shadow-stone-900/10"
        >
          Explore Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] relative">
      {/* Store Closed Banner */}
      {!settings.isStoreOpen && (
        <div className="bg-rose-600 text-white py-3 px-6 text-center sticky top-0 z-[60] shadow-xl animate-pulse">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3">
            <span className="w-2 h-2 bg-white rounded-full"></span>
            Store is currently closed. You can manage your cart, but checkout is briefly paused.
            <span className="w-2 h-2 bg-white rounded-full"></span>
          </p>
        </div>
      )}
      <div className="pt-24 px-4 pb-20">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <button onClick={() => navigate("/products")} className="group flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              <span className="text-[10px] font-bold uppercase tracking-wider">Back to Store</span>
            </button>
            <h1 className="text-2xl md:text-3xl font-black text-stone-900 tracking-tight">Your Cart</h1>
            <p className="text-stone-500 text-xs font-semibold mt-1">{cartItems.length} items in your basket</p>
          </div>
          
          <button onClick={clearCart} className="text-[10px] font-bold uppercase tracking-wider text-rose-500 bg-rose-50 px-4 py-2 rounded-lg hover:bg-rose-100 transition-colors">
             Empty Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Delivery Info Card - Blinkit Style */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200 flex items-center justify-between shadow-sm">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 18H3c-1.1 0-2-.9-2-2V7c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v2"/><path d="M16 11h2l4 4v3h-2"/><circle cx="16.5" cy="18.5" r="2.5"/><circle cx="6.5" cy="18.5" r="2.5"/></svg>
                  </div>
                  <div>
                     <p className="text-[10px] font-black uppercase text-stone-400">Arriving in 20-30 mins</p>
                     {freeDeliveryRemaining > 0 ? (
                        <p className="text-stone-600 font-bold text-xs mt-0.5">Add ₹{freeDeliveryRemaining.toFixed(2)} more for <span className="text-green-600">FREE Delivery</span></p>
                     ) : (
                        <p className="text-green-600 font-bold text-xs mt-0.5">Yay! You get FREE Delivery</p>
                     )}
                  </div>
               </div>
               {freeDeliveryRemaining > 0 && (
                  <div className="w-24 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                     <div className="h-full bg-green-500 transition-all duration-1000" style={{ width: `${Math.min(100, (totalAmount/settings.freeDeliveryThreshold)*100)}%` }}></div>
                  </div>
               )}
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
              {cartItems.map((item, idx) => (
                <div key={item._id} className={`p-4 flex items-center gap-4 transition-all duration-300 hover:bg-stone-50 ${idx !== cartItems.length - 1 ? 'border-b border-stone-100' : ''}`}>
                  <div className="w-16 h-16 bg-stone-100 rounded-xl overflow-hidden flex-shrink-0 border border-stone-50">
                     {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl font-bold text-stone-300">{item.name[0]}</div>
                     )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold text-stone-900 text-sm mb-0.5 leading-tight">{item.name}</h3>
                    <p className="text-stone-900 text-sm font-black mt-1 flex items-center gap-1">
                      ₹{item.price.toFixed(2)}
                      {item.unitQuantity && <span className="text-[10px] text-stone-400 font-bold ml-1 tracking-normal">({item.unitQuantity})</span>}
                    </p>
                  </div>

                  <div className="flex items-center bg-stone-100 p-1 rounded-lg border border-stone-200">
                    <button onClick={() => decreaseQty(item._id)} className="w-7 h-7 flex items-center justify-center text-stone-500 hover:text-stone-900 transition-all font-black text-xs">−</button>
                    <span className="w-8 text-center text-xs font-black text-stone-900">{item.quantity}</span>
                    <button onClick={() => addToCart(item)} className="w-7 h-7 flex items-center justify-center text-stone-500 hover:text-stone-900 transition-all font-black text-xs">+</button>
                  </div>

                  <div className="w-20 text-right">
                    <p className="text-sm font-black text-stone-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bill Summary - Quick Commerce Style */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-stone-200 sticky top-24">
              <h2 className="text-sm font-black text-stone-900 uppercase tracking-widest mb-6">Bill Details</h2>
              
              <div className="space-y-4 mb-6">
                 <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-stone-500">
                       <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                       <span className="text-xs font-bold">Item Total</span>
                    </div>
                    <span className="text-sm font-black text-stone-900">₹{totalAmount.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between items-center text-stone-500">
                    <div className="flex items-center gap-2">
                       <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 18H3c-1.1 0-2-.9-2-2V7c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v2"/><path d="M16 11h2l4 4v3h-2"/><circle cx="16.5" cy="18.5" r="2.5"/><circle cx="6.5" cy="18.5" r="2.5"/></svg>
                       <span className="text-xs font-bold">Delivery Fee</span>
                    </div>
                    <span className={`text-xs font-black ${deliveryCharge === 0 ? "text-green-600 uppercase" : "text-stone-900"}`}>
                       {deliveryCharge === 0 ? "Free" : `₹${deliveryCharge.toFixed(2)}`}
                    </span>
                 </div>
              </div>

              <div className="h-px bg-stone-100 mb-6"></div>

              <div className="flex justify-between items-center mb-8">
                 <span className="text-sm font-black text-stone-900 uppercase tracking-widest">Grand Total</span>
                 <span className="text-xl font-black text-stone-900">₹{finalAmount.toFixed(2)}</span>
              </div>

               <button
                 disabled={!settings.isStoreOpen}
                 onClick={() => navigate("/checkout")}
                 className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl ${
                    !settings.isStoreOpen 
                    ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700 shadow-green-600/20 active:scale-95"
                 }`}
               >
                 {settings.isStoreOpen ? "Go to Checkout" : "Store Closed"}
               </button>
              
              <div className="mt-6 p-4 bg-stone-50 rounded-xl border border-stone-100">
                 <p className="text-[10px] font-bold text-stone-400 leading-relaxed">
                    By proceeding, you agree to our friendly terms. We ensure contact-less delivery for your safety.
                 </p>
              </div>
            </div>
        </div>
      </div>
      </div>
      </div>
    </div>
  );
}

export default Cart;