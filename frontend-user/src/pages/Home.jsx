import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext.jsx";
import { useSettings } from "../context/SettingsContext.jsx";
import api from "../api/api";

const CATEGORIES = [
  { name: "Fruits & Veggies", image: "/categories/fruits.png", color: "bg-stone-50", textColor: "text-stone-800" },
  { name: "Dairy & Eggs", image: "/categories/dairy.png", color: "bg-stone-50", textColor: "text-stone-800" },
  { name: "Bread & Bakery", image: "/categories/bakery.png", color: "bg-stone-50", textColor: "text-stone-800" },
  { name: "Beverages", image: "/categories/beverages.png", color: "bg-stone-50", textColor: "text-stone-800" },
  { name: "Snacks", image: "/categories/snacks.png", color: "bg-stone-50", textColor: "text-stone-800" },
  { name: "Personal Care", image: "/categories/personal_care.png", color: "bg-stone-50", textColor: "text-stone-800" },
  { name: "Cleaning", image: "/categories/cleaning.png", color: "bg-stone-50", textColor: "text-stone-800" },
  { name: "Dry Fruits", image: "/categories/dry_fruits.png", color: "bg-stone-50", textColor: "text-stone-800" },
];

function Home() {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { user } = useAuth();
  const { settings } = useSettings();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/products").then((res) => setFeaturedProducts(res.data.slice(0, 6))).catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/products?q=${encodeURIComponent(search)}`);
  };

  const cartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="bg-[#fcfaf8] min-h-screen relative">
      {/* Store Closed Banner */}
      {!settings.isStoreOpen && (
        <div className="bg-rose-600 text-white py-3 px-6 text-center sticky top-0 z-[60] shadow-xl animate-pulse">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3">
            <span className="w-2 h-2 bg-white rounded-full"></span>
            Store is currently closed for maintenance. You can still browse, but orders are paused.
            <span className="w-2 h-2 bg-white rounded-full"></span>
          </p>
        </div>
      )}

      {/* Hero Banner - Grocery App Style */}
      <div className="bg-stone-900 text-white px-6 pt-32 pb-24 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 mb-8 animate-fade-in shadow-xl">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping"></span>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">
              {user ? `${getGreeting()}, ${user.name.split(' ')[0]}` : "30 Min Delivery in your area"}
            </p>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tighter animate-slide-up">
            Everything you need, <br/> delivered in <span className="text-green-400">30 minutes.</span>
          </h1>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto group">
            <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none text-stone-500 group-focus-within:text-green-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for groceries, snacks and more"
              className="w-full bg-white border-2 border-transparent px-16 py-6 rounded-2xl text-stone-900 placeholder-stone-400 font-bold shadow-2xl focus:outline-none focus:border-green-500 transition-all text-sm group-hover:scale-[1.01] duration-300"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-stone-900 text-white hover:bg-green-500 px-8 py-3.5 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all active:scale-95"
            >
              Search
            </button>
          </form>
          
          <div className="mt-10 flex justify-center items-center gap-8 text-[10px] font-black uppercase tracking-widest text-stone-500">
             <span className="flex items-center gap-2 underline decoration-green-500/50 underline-offset-4">Express Delivery</span>
             <span className="flex items-center gap-2 underline decoration-green-500/50 underline-offset-4">Handpicked Fresh</span>
             <span className="flex items-center gap-2 underline decoration-green-500/50 underline-offset-4">Safe Checkout</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-10 relative z-20">
        {/* Compact Service Banner - Horizontal Ticker Style */}
        <div className="bg-white rounded-2xl p-4 shadow-xl border border-stone-100 mb-12 flex flex-col md:flex-row items-center justify-between gap-4 overflow-hidden mt-12 md:mt-0">
          {[
            {
              icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
              title: "30 Min Delivery",
              desc: "Express Hubs Nearby"
            },
            {
              icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
              title: "Quality Checked",
              desc: "Triple-Fresh Promise"
            },
            {
              icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
              title: "Best Prices",
              desc: "Verified Daily Rates"
            }
          ].map((promise, idx) => (
            <div key={idx} className="flex items-center gap-4 px-6 md:border-r last:border-0 border-stone-100 w-full md:w-auto">
               <div className="w-10 h-10 bg-stone-50 rounded-full flex items-center justify-center flex-shrink-0">
                  {promise.icon}
               </div>
               <div>
                  <h3 className="font-black text-stone-900 text-xs uppercase tracking-tight">{promise.title}</h3>
                  <p className="text-stone-400 text-[10px] font-bold">{promise.desc}</p>
               </div>
            </div>
          ))}
          <div className="hidden lg:flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full transform scale-90">
             <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
             <span className="text-[9px] font-black uppercase text-emerald-600 tracking-widest">Safe & Secured</span>
          </div>
        </div>

        {/* Categories */}
        <section className="mb-24">
          <div className="flex justify-between items-baseline mb-12">
            <div>
               <h2 className="text-4xl font-serif font-bold text-stone-800">Explore our favorites</h2>
               <p className="text-[11px] font-black text-stone-400 uppercase tracking-widest mt-2 px-1">Handpicked for you every morning</p>
            </div>
            <button
              onClick={() => navigate("/products")}
              className="text-stone-400 text-[11px] font-black uppercase tracking-widest hover:text-stone-900 transition-colors border-b-2 border-transparent hover:border-stone-900 pb-2 flex items-center gap-2"
            >
              Show all categories
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                onClick={() => navigate(`/products?q=${encodeURIComponent(cat.name.split(" ")[0])}`)}
                className={`flex flex-col items-center gap-5 transition-all group`}
              >
                <div className="w-full aspect-square bg-white rounded-[2rem] overflow-hidden shadow-xl shadow-stone-200/50 group-hover:shadow-2xl group-hover:-translate-y-2 transition-all p-1">
                   <img src={cat.image} alt={cat.name} className="w-full h-full object-cover rounded-[1.8rem]" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest text-stone-800 text-center leading-tight group-hover:text-green-600 transition-colors">{cat.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <section className="mb-24">
            <div className="flex justify-between items-baseline mb-12">
              <div>
                 <h2 className="text-4xl font-serif font-bold text-stone-800">Things you'll love</h2>
                 <p className="text-[11px] font-black text-stone-400 uppercase tracking-widest mt-2 px-1">The local essentials everyone is talking about</p>
              </div>
              <button
                onClick={() => navigate("/products")}
                className="text-stone-400 text-[11px] font-black uppercase tracking-widest hover:text-stone-900 transition-colors border-b-2 border-transparent hover:border-stone-900 pb-2 flex items-center gap-2"
              >
                Full Catalog
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 px-1">
              {featuredProducts.map((product) => (
                <MiniProductCard key={product._id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Banner Promo */}
        <div className="bg-stone-900 rounded-[4rem] p-16 mb-24 flex flex-col md:flex-row items-center justify-between relative overflow-hidden shadow-2xl group border border-white/5">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
          <div className="relative z-10 text-center md:text-left mb-12 md:mb-0">
            <p className="text-green-400 text-[11px] font-black uppercase tracking-[0.4em] mb-6">Discovery Bonus</p>
            <h3 className="text-5xl font-serif font-bold text-white mb-4 tracking-tighter">Your first delivery is on us</h3>
            <p className="text-stone-400 text-lg font-medium max-w-lg italic border-l-4 border-stone-700 pl-6 ml-1">Experience the Spixo difference today. No delivery fees on your first order of fresh essentials.</p>
          </div>
          <div className="flex flex-col items-center gap-8 relative z-10">
             <div className="w-24 h-24 bg-white/5 backdrop-blur-xl rounded-[2.5rem] flex items-center justify-center text-green-400 shadow-2xl animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 18H3c-1.1 0-2-.9-2-2V7c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v2"/><path d="M16 11h2l4 4v3h-2"/><circle cx="16.5" cy="18.5" r="2.5"/><circle cx="6.5" cy="18.5" r="2.5"/></svg>
             </div>
             <button onClick={() => navigate("/products")} className="bg-white text-stone-900 px-12 py-5 rounded-2xl font-black text-[12px] uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all shadow-2xl active:scale-95">Complete your list</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniProductCard({ product }) {
  const { cartItems, addToCart, decreaseQty } = useCart();
  const { settings } = useSettings();
  const cartItem = cartItems.find((i) => i._id === product._id);
  const qty = cartItem?.quantity || 0;

  // Stock status logic
  const isOutOfStock = product.stock === 0;
  const isFewLeft = product.stock > 0 && product.stock <= 5;
  const originalPrice = product.discount > 0 ? Math.round(product.price / (1 - product.discount / 100)) : null;

  return (
    <div className="bg-white rounded-[2rem] p-4 shadow-sm hover:shadow-xl transition-all duration-500 group border border-stone-50">
      <div className="aspect-square bg-stone-50 rounded-2xl mb-4 flex items-center justify-center overflow-hidden relative">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-2xl group-hover:scale-110 transition-transform duration-700" />
        ) : (
          <span className="text-3xl grayscale opacity-50">{product.name[0]}</span>
        )}
        
        {/* Indicators Overlay */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
          {product.discount > 0 && (
             <span className="bg-rose-500 text-white text-[9px] font-black px-2 py-1 rounded-lg shadow-sm uppercase tracking-wider">-{product.discount}%</span>
          )}
          {isOutOfStock && (
             <span className="bg-stone-800 text-white text-[9px] font-black px-2 py-1 rounded-lg shadow-sm uppercase tracking-wider">Sold Out</span>
          )}
          {isFewLeft && (
             <span className="bg-amber-500 text-white text-[9px] font-black px-2 py-1 rounded-lg shadow-sm uppercase tracking-wider">Few Left</span>
          )}
        </div>
      </div>

      <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">{product.category?.split(" ")[0]}</p>
      <p className="text-sm font-bold text-stone-800 truncate mb-1">{product.name}</p>
      <p className="text-stone-400 text-[10px] font-bold uppercase tracking-tighter mb-4">
         {product.unit === 'kg' ? 'per kg' : product.unit === 'dozen' ? 'per dozen' : product.unit === 'unit' ? 'per piece' : product.unit === 'litre' ? 'per litre' : `per ${product.unit}`}
      </p>
      
      <div className="flex items-baseline gap-2 mb-4">
        <p className="text-stone-900 font-black text-lg">
          ₹{product.price}
          {product.unitQuantity && <span className="text-xs text-stone-500 font-medium ml-1 tracking-normal">/ {product.unitQuantity}</span>}
        </p>
        {originalPrice && (
          <p className="text-stone-300 text-xs line-through font-medium">₹{originalPrice}</p>
        )}
      </div>

      <div className="mt-auto">
        {isOutOfStock ? (
          <button disabled className="w-full text-xs bg-stone-50 text-stone-300 font-bold py-3 rounded-xl border border-stone-100 italic">
            Out of Stock
          </button>
        ) : !settings.isStoreOpen ? (
          <button disabled className="w-full text-[9px] bg-stone-50 text-stone-400 font-black py-3 rounded-xl border border-stone-100 uppercase tracking-widest">
            Paused
          </button>
        ) : qty === 0 ? (
          <button
            onClick={() => addToCart(product)}
            className="w-full text-xs bg-white text-stone-800 border-2 border-stone-100 font-black py-3 rounded-xl hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all active:scale-95 shadow-sm"
          >
            + ADD
          </button>
        ) : (
          <div className="flex items-center justify-between bg-stone-900 rounded-xl px-3 py-2.5 shadow-lg">
            <button onClick={() => decreaseQty(product._id)} className="text-white font-black hover:text-green-400 transition-colors">−</button>
            <span className="text-white font-black text-xs">{qty}</span>
            <button onClick={() => addToCart(product)} className="text-white font-black hover:text-green-400 transition-colors">+</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;