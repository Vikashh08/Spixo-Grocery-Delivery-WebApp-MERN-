import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import { useCart } from "../context/CartContext";
import { useSettings } from "../context/SettingsContext.jsx";

const CATEGORIES = ["All", "Fruits & Veggies", "Dairy & Eggs", "Bread & Bakery", "Beverages", "Snacks", "Personal Care", "Cleaning", "Dry Fruits"];

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchParams] = useSearchParams();
  const { cartItems, addToCart, decreaseQty } = useCart();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";

  useEffect(() => {
    setLoading(true);
    api.get("/products").then((res) => {
      setProducts(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesQuery = !query || p.name.toLowerCase().includes(query.toLowerCase()) || p.category?.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = activeCategory === "All" || p.category?.toLowerCase().includes(activeCategory.split(" ")[0].toLowerCase());
    return matchesQuery && matchesCategory;
  });

  return (
    <div className="bg-[#fcfaf8] min-h-screen relative">
      {/* Store Closed Banner */}
      {!settings.isStoreOpen && (
        <div className="bg-rose-600 text-white py-3 px-6 text-center sticky top-0 z-[60] shadow-xl animate-pulse">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3">
            <span className="w-2 h-2 bg-white rounded-full"></span>
            Store is currently closed. You can browse, but orders are briefly paused.
            <span className="w-2 h-2 bg-white rounded-full"></span>
          </p>
        </div>
      )}
      <div className="pt-24 px-6">
        {/* Header & Categories */}
        <div className="max-w-7xl mx-auto mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div className="flex-1">
              <button onClick={() => navigate("/")} className="group flex items-center gap-3 text-stone-400 hover:text-stone-900 transition-colors mb-6">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:bg-stone-900 group-hover:text-white transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest">Home</span>
              </button>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900">
                {query ? `Search results for "${query}"` : "The Catalog"}
              </h1>
              <p className="text-stone-400 mt-4 font-medium italic">Handpicked freshness delivered to your doorstep</p>
            </div>

          </div>

          {/* Category Tabs */}
          <div className="flex gap-3 overflow-x-auto pb-6 scrollbar-hide -mx-2 px-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-8 py-4 rounded-2xl text-sm font-bold transition-all ${activeCategory === cat
                    ? "bg-white text-stone-900 shadow-xl shadow-stone-200/50 scale-105"
                    : "bg-stone-100/50 text-stone-400 hover:bg-white hover:text-stone-900"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-6">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-xl mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-stone-100 rounded-[2rem] flex items-center justify-center mb-8 text-stone-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-700">No products found</h3>
              <p className="text-gray-400 mt-2">Try searching for something else</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredProducts.map((p) => {
                const cartItem = cartItems.find((item) => item._id === p._id);
                const qty = cartItem?.quantity || 0;
                const isOutOfStock = p.stock === 0;
                const isFewLeft = p.stock > 0 && p.stock <= 5;
                const originalPrice = p.discount > 0 ? Math.round(p.price / (1 - p.discount / 100)) : null;

                return (
                  <div
                    key={p._id}
                    className="bg-white rounded-[2rem] p-4 shadow-sm hover:shadow-2xl transition-all duration-500 group border border-stone-50"
                  >
                    {/* Product Image */}
                    <div className="aspect-square bg-stone-50 rounded-2xl mb-4 flex items-center justify-center overflow-hidden relative shadow-inner">
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover rounded-2xl group-hover:scale-110 transition-transform duration-700" />
                      ) : (
                        <span className="text-4xl grayscale opacity-50">{p.name[0]}</span>
                      )}

                      {/* Indicators Overlay */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1.5">
                        {p.discount > 0 && (
                          <span className="bg-rose-500 text-white text-[9px] font-black px-2 py-1 rounded-lg shadow-sm uppercase tracking-wider">-{p.discount}%</span>
                        )}
                        {isOutOfStock && (
                          <span className="bg-stone-800 text-white text-[9px] font-black px-2 py-1 rounded-lg shadow-sm uppercase tracking-wider">Sold Out</span>
                        )}
                        {isFewLeft && (
                          <span className="bg-amber-500 text-white text-[9px] font-black px-2 py-1 rounded-lg shadow-sm uppercase tracking-wider">Few Left</span>
                        )}
                      </div>
                    </div>

                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">{p.category?.split(" ")[0]}</p>
                    <h3 className="font-bold text-stone-800 text-sm mb-1 leading-tight truncate">{p.name}</h3>
                    <p className="text-stone-400 text-[10px] font-bold uppercase tracking-tighter mb-4">
                      {p.unit === 'kg' ? 'per kg' : p.unit === 'dozen' ? 'per dozen' : p.unit === 'unit' ? 'per piece' : p.unit === 'litre' ? 'per litre' : `per ${p.unit}`}
                    </p>

                    <div className="flex items-baseline gap-2 mb-5">
                      <p className="text-stone-900 font-black text-xl">
                        ₹{p.price}
                        {p.unitQuantity && <span className="text-sm text-stone-500 font-medium ml-1 tracking-normal">/ {p.unitQuantity}</span>}
                      </p>
                      {originalPrice && (
                        <p className="text-stone-300 text-xs line-through font-medium">₹{originalPrice}</p>
                      )}
                    </div>

                    <div className="mt-auto">
                      {isOutOfStock ? (
                        <button disabled className="w-full text-[10px] bg-stone-50 text-stone-300 font-black py-4 rounded-xl border border-stone-100 italic uppercase">
                          Out of Stock
                        </button>
                      ) : !settings.isStoreOpen ? (
                        <button disabled className="w-full text-[10px] bg-stone-50 text-stone-400 font-black py-4 rounded-xl border border-stone-100 uppercase tracking-widest">
                          Paused
                        </button>
                      ) : qty === 0 ? (
                        <button
                          onClick={() => addToCart(p)}
                          className="w-full text-xs bg-white text-stone-800 border-2 border-stone-100 font-black py-4 rounded-xl hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all active:scale-95 shadow-sm"
                        >
                          + ADD TO CART
                        </button>
                      ) : (
                        <div className="flex items-center justify-between bg-stone-900 rounded-xl px-4 py-3 shadow-lg">
                          <button onClick={() => decreaseQty(p._id)} className="text-white font-black hover:text-green-400 transition-colors">−</button>
                          <span className="text-white font-black text-sm">{qty}</span>
                          <button onClick={() => addToCart(p)} className="text-white font-black hover:text-green-400 transition-colors">+</button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Products;