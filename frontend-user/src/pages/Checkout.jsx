import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext.jsx";
import { useSettings } from "../context/SettingsContext.jsx";
import api from "../api/api";

function Checkout() {
  const { cartItems, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const [deliverySlot, setDeliverySlot] = useState("FAST");
  const [paymentMethod] = useState("COD");
  const [status, setStatus] = useState("idle");
  const [address, setAddress] = useState({ house: "", street: "", landmark: "", area: "", pincode: "" });
  const [saveAddress, setSaveAddress] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedSavedId, setSelectedSavedId] = useState(null);
  const { settings } = useSettings();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user's saved addresses
    api.get("/user/profile").then((res) => {
      if (res.data.addresses) {
        setSavedAddresses(res.data.addresses);
      }
    }).catch(() => {});
  }, []);

  const handleSelectSaved = (savedAddr) => {
    setSelectedSavedId(savedAddr._id);
    setAddress({
      house: savedAddr.house || "",
      street: savedAddr.street || "",
      landmark: savedAddr.landmark || "",
      area: savedAddr.area || "",
      pincode: savedAddr.pincode || ""
    });
  };

  const deliveryCharge = totalAmount >= settings.freeDeliveryThreshold ? 0 : settings.deliveryCharge;
  const finalAmount = totalAmount + deliveryCharge;

  const placeOrder = async () => {
    if (status === "processing") return;
    if (!settings.isStoreOpen) {
      alert("Store is currently closed. We are not accepting orders at the moment.");
      return;
    }
    if (!address.house || !address.street || !address.area) {
      alert("Please fill in or select a delivery address");
      return;
    }

    setStatus("processing");
    try {
      // Save address if requested and not already saved
      if (saveAddress && !selectedSavedId) {
        await api.post("/user/address", address);
      }

      const res = await api.post("/orders", {
        items: cartItems.map((item) => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          unit: item.unit,
          unitQuantity: item.unitQuantity
        })),
        address,
        subtotal: totalAmount,
        deliverySlot,
        paymentMethod
      });

      if (res.status === 201 || res.status === 200) {
        setStatus("success");
        clearCart();
        // Pass skipLoader state so the global App.jsx loader doesn't overlap
        setTimeout(() => navigate("/orders", { state: { skipLoader: true } }), 1000); 
      }
    } catch (err) {
      setStatus("idle");
      alert(err.response?.data?.message || "Order failed. Please try again.");
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#fcfaf8] flex flex-col items-center justify-center p-6 text-center pt-24">
        <div className="w-32 h-32 bg-stone-100 rounded-[3rem] flex items-center justify-center mb-10 text-stone-300">
          <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
        </div>
        <h2 className="text-4xl font-serif font-bold text-stone-900 mb-4 tracking-tight">Your basket is waiting</h2>
        <p className="text-stone-400 mb-10 max-w-sm font-medium leading-relaxed italic">Handpick the freshest ingredients and they will appear here, ready for your kitchen.</p>
        <button 
          onClick={() => navigate("/products")} 
          className="bg-stone-900 text-white font-serif font-bold px-12 py-5 rounded-2xl hover:bg-green-500 transition-all active:scale-95 shadow-2xl shadow-stone-900/10 uppercase tracking-widest text-[11px]"
        >
          Start Shopping
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
            Store is currently closed. Orders are briefly paused for maintenance.
            <span className="w-2 h-2 bg-white rounded-full"></span>
          </p>
        </div>
      )}
      <div className="pt-24 px-4 pb-20">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button onClick={() => navigate("/cart")} className="group flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            <span className="text-[10px] font-bold uppercase tracking-wider">Back to Basket</span>
          </button>
          <h1 className="text-2xl md:text-3xl font-black text-stone-900 tracking-tight">Checkout</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            
            {/* Delivery Address Section - Compact Grocery Style */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
                     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                  <h2 className="font-black text-stone-900 text-sm uppercase tracking-widest leading-none">Delivery Address</h2>
               </div>

              {savedAddresses.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {savedAddresses.map((saved) => (
                    <button
                      key={saved._id}
                      onClick={() => handleSelectSaved(saved)}
                      className={`text-left p-4 rounded-xl border-2 transition-all group relative ${
                        selectedSavedId === saved._id 
                          ? "border-green-600 bg-green-50/30" 
                          : "border-stone-100 hover:border-stone-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                         <span className="text-[9px] font-bold uppercase text-stone-400">Saved Address</span>
                         {selectedSavedId === saved._id && (
                            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                               <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            </div>
                         )}
                      </div>
                      <p className="font-bold text-xs text-stone-900 leading-snug">{saved.house}, {saved.street}</p>
                      <p className="text-[9px] font-bold text-stone-400 mt-0.5 uppercase tracking-wider">{saved.area} • {saved.pincode}</p>
                    </button>
                  ))}
                  <button 
                    onClick={() => { setSelectedSavedId(null); setAddress({ house: "", street: "", landmark: "", area: "", pincode: "" }); }}
                    className="p-4 rounded-xl border-2 border-dashed border-stone-200 text-stone-400 hover:text-stone-600 hover:border-stone-300 transition-all text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    + Use another address
                  </button>
                </div>
              ) : (
                 <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                       <input
                         type="text"
                         placeholder="House No / Shop Name"
                         value={address.house}
                         onChange={(e) => setAddress({ ...address, house: e.target.value })}
                         className="col-span-2 w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-green-500 transition-all text-xs font-bold text-stone-900"
                       />
                       <input
                         type="text"
                         placeholder="Street / Locality"
                         value={address.street}
                         onChange={(e) => setAddress({ ...address, street: e.target.value })}
                         className="col-span-2 w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-green-500 transition-all text-xs font-bold text-stone-900"
                       />
                       <input
                         type="text"
                         placeholder="Area"
                         value={address.area}
                         onChange={(e) => setAddress({ ...address, area: e.target.value })}
                         className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-green-500 transition-all text-xs font-bold text-stone-900"
                       />
                       <input
                         type="text"
                         placeholder="Pincode"
                         value={address.pincode}
                         onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                         className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-green-500 transition-all text-xs font-bold text-stone-900"
                       />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer group">
                       <input type="checkbox" checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)} className="rounded border-stone-300 text-green-600 focus:ring-green-500" />
                       <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest group-hover:text-stone-900 transition-colors">Save this address</span>
                    </label>
                 </div>
              )}
            </section>

            {/* Delivery Time Section - Compact */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center text-amber-500">
                     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  </div>
                  <h2 className="font-black text-stone-900 text-sm uppercase tracking-widest leading-none">Delivery Slot</h2>
               </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: "FAST", label: "Deliver Now", sub: "Arrives in 20-30 mins" },
                  { id: "EVENING", label: "Evening Delivery", sub: "6:00 PM - 9:00 PM" }
                ].map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => setDeliverySlot(slot.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      deliverySlot === slot.id
                        ? "border-amber-500 bg-amber-50/30"
                        : "border-stone-100 hover:border-stone-200"
                    }`}
                  >
                    <p className="font-bold text-xs text-stone-900">{slot.label}</p>
                    <p className="text-[10px] font-bold text-stone-400 mt-0.5">{slot.sub}</p>
                  </button>
                ))}
              </div>
            </section>

            {/* Payment Section - Compact */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500">
                     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                  </div>
                  <h2 className="font-black text-stone-900 text-sm uppercase tracking-widest leading-none">Payment Method</h2>
               </div>
              <div className="space-y-3">
                {/* Active Payment Method */}
                <div className="p-4 rounded-xl border-2 border-emerald-500 bg-emerald-50/30 flex items-center justify-between cursor-pointer transition-all">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">💵</span>
                    <div>
                      <p className="font-bold text-xs text-stone-900">Cash on Delivery</p>
                      <p className="text-[9px] font-black uppercase text-emerald-600">Active</p>
                    </div>
                  </div>
                  <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                     <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                </div>

                {/* Disabled Payment Method */}
                <div className="p-4 rounded-xl border-2 border-stone-100 bg-stone-50 flex items-center justify-between opacity-60 cursor-not-allowed">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">💳</span>
                    <div>
                      <p className="font-bold text-xs text-stone-900">UPI / Cards</p>
                      <p className="text-[9px] font-bold uppercase text-stone-400">Coming Soon</p>
                    </div>
                  </div>
                  <div className="w-5 h-5 border-2 border-stone-200 rounded-full"></div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Sidebar - Bill Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-stone-200 sticky top-24">
              <h2 className="text-sm font-black text-stone-900 uppercase tracking-widest mb-6">Bill Details</h2>
              
              <div className="space-y-3 mb-6">
                 {cartItems.map((item) => (
                    <div key={item._id} className="flex justify-between items-center text-[11px] font-bold text-stone-500">
                       <span className="truncate pr-4">
                         {item.name} {item.unitQuantity && `(${item.unitQuantity})`} x {item.quantity}
                       </span>
                       <span className="text-stone-900 flex-shrink-0">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                 ))}
              </div>

              <div className="h-px bg-stone-100 mb-6"></div>

              <div className="space-y-4 mb-8">
                 <div className="flex justify-between items-center text-xs font-bold text-stone-500">
                    <span>Item Total</span>
                    <span className="text-stone-900">₹{totalAmount.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between items-center text-xs font-bold text-stone-500">
                    <span>Delivery Fee</span>
                    <span className={deliveryCharge === 0 ? "text-green-600 uppercase" : "text-stone-900"}>
                       {deliveryCharge === 0 ? "Free" : `₹${deliveryCharge.toFixed(2)}`}
                    </span>
                 </div>
                 <div className="flex justify-between items-center pt-4 border-t border-stone-50">
                    <span className="text-sm font-black text-stone-900 uppercase">Grand Total</span>
                    <span className="text-xl font-black text-stone-900">₹{finalAmount.toFixed(2)}</span>
                 </div>
              </div>

              <button
                disabled={status !== "idle" || !settings.isStoreOpen || (!selectedSavedId && (!address.house || !address.street))}
                onClick={placeOrder}
                className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl ${
                  status !== "idle" || !settings.isStoreOpen || (!selectedSavedId && (!address.house || !address.street))
                    ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700 shadow-green-600/20 active:scale-95"
                }`}
              >
                {status === "processing" ? "Verifying..." : !settings.isStoreOpen ? "Store Closed" : "Place Order Now"}
              </button>
              
              <div className="mt-6 p-4 bg-stone-50 rounded-xl border border-stone-100 text-center">
                 <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Safe & Secure Payments</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Overlays - Redesigned to be faster */}
      {status === "processing" && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-fade-in">
           <div className="bg-white rounded-3xl p-10 flex flex-col items-center text-center shadow-2xl max-w-sm w-full animate-scale-in">
              <div className="w-16 h-16 border-4 border-stone-100 border-t-green-600 rounded-full animate-spin mb-6"></div>
              <h3 className="text-xl font-black text-stone-900 mb-2">Placing Order</h3>
              <p className="text-stone-400 text-xs font-bold">Please don't close this window...</p>
           </div>
        </div>
      )}

      {status === "success" && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-fade-in">
           <div className="bg-white rounded-3xl p-10 flex flex-col items-center text-center shadow-2xl max-w-sm w-full animate-scale-in">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-8 shadow-xl shadow-green-500/30">
                 <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h3 className="text-2xl font-black text-stone-900 mb-2">Order Confirmed!</h3>
              <p className="text-stone-500 text-sm font-bold mb-8">We're getting your groceries ready. Arriving in 15 mins!</p>
              <div className="bg-stone-900 text-white text-[10px] font-bold px-6 py-2 rounded-full uppercase tracking-tighter">
                 Redirecting to your orders...
              </div>
           </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default Checkout;