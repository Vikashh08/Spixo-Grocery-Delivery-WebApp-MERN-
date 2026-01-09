import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/api";
import { useCart } from "../context/CartContext";

function Products() {
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();
  
  // Use the context directly 
  const { cartItems, addToCart, decreaseQty } = useCart();
  
  const query = searchParams.get("q") || "";

  useEffect(() => {
    api.get("/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("API Error:", err));
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    (p.category && p.category.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="bg-[#fdfcfb] min-h-screen px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-serif font-bold text-stone-800 mb-12">
          {query ? `Results for "${query}"` : "Daily Essentials"}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {filteredProducts.map((p) => {
            // Check if item is in cart to toggle buttons
            const cartItem = cartItems.find((item) => item._id === p._id);
            const qty = cartItem ? cartItem.quantity : 0;

            return (
              <div key={p._id} className="bg-white border border-stone-100 rounded-[2.5rem] p-5 flex flex-col justify-between hover:shadow-xl transition-all">
                <div>
                  <div className="aspect-square bg-stone-50 rounded-3xl mb-5 flex items-center justify-center font-serif text-4xl italic text-stone-200">
                    {p.name[0]}
                  </div>
                  <h3 className="font-bold text-stone-800 text-lg truncate">{p.name}</h3>
                  <p className="text-xl font-serif font-bold text-emerald-800 mt-2">₹{p.price}</p>
                </div>

                <div className="mt-6">
                  {qty === 0 ? (
                    <button
                      onClick={() => addToCart(p)}
                      className="w-full py-3 bg-stone-900 text-white rounded-2xl font-bold hover:bg-emerald-800 transition-all active:scale-95"
                    >
                      Add to Cart
                    </button>
                  ) : (
                    <div className="flex items-center justify-between bg-stone-50 border border-stone-100 rounded-2xl p-1">
                      <button onClick={() => decreaseQty(p._id)} className="w-10 h-10 text-stone-400 font-bold hover:text-red-500">−</button>
                      <span className="font-bold text-stone-800">{qty}</span>
                      <button onClick={() => addToCart(p)} className="w-10 h-10 text-stone-400 font-bold hover:text-emerald-700">+</button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Products;