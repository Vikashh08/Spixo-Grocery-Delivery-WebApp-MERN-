import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import api from "../api/api";
import { AiOutlineArrowLeft, AiOutlineCheckCircle, AiOutlineLoading3Quarters } from "react-icons/ai";

function Checkout() {
  const { cartItems, totalAmount, clearCart } = useCart();
  const [deliverySlot, setDeliverySlot] = useState("FAST");
  const [status, setStatus] = useState("idle"); // 'idle', 'processing', 'success'
  const navigate = useNavigate();

  const deliveryCharge = totalAmount >= 500 ? 0 : 40;
  const finalAmount = totalAmount + deliveryCharge;

  const placeOrder = async () => {
    // 1. Initial Safeguard
    if (status === "processing") return;
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    setStatus("processing");

    try {
      const orderData = {
        items: cartItems.map((item) => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        subtotal: totalAmount,
        deliveryCharge,
        totalAmount: finalAmount,
        deliverySlot,
      };

      // 2. API Call to your backend
      const response = await api.post("/orders", orderData);

      // 3. Logic for Redirect (Handling the Confirmation)
      if (response.status === 201 || response.status === 200) {
        setStatus("success");
        console.log("Order stored in DB successfully.");
        
        // Clear cart first so the user doesn't see old items
        clearCart(); 

        // Redirect to the success route defined in App.jsx after a short delay
        setTimeout(() => {
          navigate("/order-success");
        }, 1200); 
      }
    } catch (error) {
      setStatus("idle");
      const errorMsg = error.response?.data?.message || "Order creation failed on server.";
      alert(`Error: ${errorMsg}`);
      console.error("Order error detail:", error);
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdfcfb] font-serif">
        <h2 className="text-2xl text-stone-800">Your basket is empty</h2>
        <button onClick={() => navigate("/products")} className="mt-4 text-emerald-800 font-bold border-b border-emerald-800">Return to Boutique</button>
      </div>
    );
  }

  return (
    <div className="bg-[#fdfcfb] min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate("/cart")} className="flex items-center gap-2 text-stone-400 font-bold text-[10px] tracking-widest mb-8 uppercase">
          <AiOutlineArrowLeft /> Back to Basket
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Form Side */}
          <div className="lg:col-span-3 space-y-6">
            <section className="bg-white border border-stone-100 rounded-[2.5rem] p-8 shadow-sm">
              <h3 className="text-xl font-serif font-bold text-stone-800 mb-6">Delivery Slot</h3>
              <div className="space-y-4">
                {["FAST", "EVENING"].map((slot) => (
                  <div 
                    key={slot}
                    onClick={() => setDeliverySlot(slot)}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex justify-between items-center ${
                      deliverySlot === slot ? "border-emerald-700 bg-emerald-50/20" : "border-stone-50"
                    }`}
                  >
                    <span className="font-bold text-stone-800 text-sm tracking-tight">{slot === "FAST" ? "Express Delivery" : "Evening Delivery"}</span>
                    <span className="text-[10px] font-bold text-emerald-800 italic uppercase">{slot}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Summary Side */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-stone-100 rounded-[2.5rem] p-8 sticky top-10 shadow-sm">
              <div className="space-y-3 mb-8">
                <div className="flex justify-between text-xs font-bold text-stone-400 uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span>₹{totalAmount}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-stone-400 uppercase tracking-widest">
                  <span>Delivery</span>
                  <span>{deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}</span>
                </div>
                <div className="h-px bg-stone-50 my-4"></div>
                <div className="flex justify-between text-2xl font-serif font-bold text-stone-800">
                  <span>Total</span>
                  <span className="text-emerald-800 italic">₹{finalAmount}</span>
                </div>
              </div>

              <button 
                onClick={placeOrder}
                disabled={status !== "idle"}
                className={`w-full py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all ${
                  status === "success" ? "bg-emerald-600 text-white" : "bg-stone-900 text-white hover:bg-stone-800"
                }`}
              >
                {status === "idle" && "PLACE SECURE ORDER"}
                {status === "processing" && <AiOutlineLoading3Quarters className="animate-spin" />}
                {status === "success" && <><AiOutlineCheckCircle size={20} /> ORDER PLACED</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;