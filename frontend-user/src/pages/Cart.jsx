import { useCart } from '../context/CartContext'; // Ensure path matches your project
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowLeft, AiOutlineDelete } from "react-icons/ai";

function Cart() {
  const { cartItems, addToCart, decreaseQty, totalAmount } = useCart() || { cartItems: [] };
  const navigate = useNavigate();

  const deliveryCharge = totalAmount >= 500 ? 0 : 40; // Delivery logic from your controller
  const finalAmount = totalAmount + deliveryCharge;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center bg-[#fdfcfb]">
        <div className="w-32 h-32 bg-stone-100 rounded-full flex items-center justify-center text-6xl mb-6 animate-pulse">
          🛒
        </div>
        <h2 className="text-3xl font-serif font-bold text-stone-800 mb-2">Your basket is empty</h2>
        <p className="text-stone-500 mb-8 max-w-sm">
          "The finest ingredients are waiting. Start adding them to your collection."
        </p>
        <button
          onClick={() => navigate("/products")}
          className="bg-stone-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-emerald-800 transition-all shadow-xl shadow-stone-200 active:scale-95"
        >
          Browse Collection
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#fdfcfb] min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={() => navigate("/products")}
          className="flex items-center gap-2 text-stone-400 hover:text-stone-800 font-bold text-sm mb-10 transition-colors group"
        >
          <AiOutlineArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          CONTINUE SHOPPING
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* Items List */}
          <div className="lg:col-span-2 space-y-6">
            <h1 className="text-4xl font-serif font-bold text-stone-800 mb-10">Shopping Basket</h1>
            
            {cartItems.map((item) => (
              <div 
                key={item._id} 
                className="flex items-center gap-6 bg-white border border-stone-100 p-6 rounded-[2.5rem] hover:shadow-lg transition-all duration-500"
              >
                {/* Item Thumbnail */}
                <div className="w-24 h-24 bg-stone-50 rounded-3xl flex items-center justify-center text-3xl font-serif italic text-stone-200">
                  {item.name[0]}
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-stone-800 text-lg leading-tight">{item.name}</h3>
                  <p className="text-stone-400 text-sm font-medium uppercase tracking-widest mt-1">
                    {item.quantity} units • ₹{item.price} each
                  </p>
                </div>

                {/* Smooth Quantity Controls */}
                <div className="flex items-center gap-4 bg-stone-50 border border-stone-100 rounded-2xl p-1.5 px-4">
                  <button 
                    onClick={() => decreaseQty(item._id)}
                    className="text-stone-400 hover:text-red-500 font-bold text-xl transition-colors"
                  >
                    −
                  </button>
                  <span className="font-bold text-stone-800 w-4 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => addToCart(item)}
                    className="text-stone-400 hover:text-emerald-700 font-bold text-xl transition-colors"
                  >
                    +
                  </button>
                </div>

                <div className="text-right ml-4">
                  <p className="font-serif font-bold text-stone-800 text-xl">₹{item.price * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Premium Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-stone-100 rounded-[3rem] p-10 sticky top-32 shadow-sm">
              <h3 className="text-2xl font-serif font-bold text-stone-800 mb-8 border-b border-stone-50 pb-4">Summary</h3>
              
              <div className="space-y-5 text-sm font-medium">
                <div className="flex justify-between text-stone-500">
                  <span>Subtotal</span>
                  <span className="text-stone-800 font-bold">₹{totalAmount}</span>
                </div>
                
                <div className="flex justify-between text-stone-500">
                  <span>Delivery Fee</span>
                  <span>
                    {deliveryCharge === 0 ? (
                      <span className="text-emerald-700 font-bold italic">FREE</span>
                    ) : (
                      <span className="text-stone-800 font-bold">₹{deliveryCharge}</span>
                    )}
                  </span>
                </div>

                {deliveryCharge > 0 && (
                  <p className="text-[10px] text-stone-400 uppercase tracking-tighter">
                    Add ₹{500 - totalAmount} more for free delivery
                  </p>
                )}

                <div className="h-px bg-stone-100 my-6"></div>

                <div className="flex justify-between text-xl font-serif font-bold text-stone-800">
                  <span>Total Amount</span>
                  <span className="text-emerald-800 italic">₹{finalAmount}</span>
                </div>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full mt-10 bg-stone-900 text-white py-5 rounded-2xl font-bold hover:bg-emerald-800 transition-all shadow-xl shadow-stone-100 active:scale-[0.98]"
              >
                Proceed to Checkout
              </button>

              <p className="text-center text-stone-400 text-[10px] mt-6 font-medium uppercase tracking-widest">
                Secure SSL Encryption
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Cart;