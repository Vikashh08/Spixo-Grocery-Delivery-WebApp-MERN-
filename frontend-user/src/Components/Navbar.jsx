import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext";

function Navbar() {
  const { user, logout, isLoggedIn } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/products", label: "Shop" },
    { path: "/orders", label: "Orders" },
    { path: "/contact", label: "Support" },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
        isScrolled 
          ? "bg-white/80 backdrop-blur-2xl border-stone-200 py-3 shadow-xl shadow-stone-200/20" 
          : "bg-transparent border-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-white border border-stone-100 rounded-2xl flex items-center justify-center group-hover:bg-green-50 transition-all duration-500 shadow-xl shadow-stone-900/10 overflow-hidden">
              <img src="/logo.ico" alt="S" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className={`text-xl font-serif font-bold tracking-tight transition-colors ${isScrolled || location.pathname !== "/" ? "text-stone-900" : "text-white"}`}>Spixo</span>
              <span className="text-[9px] text-green-500 font-black uppercase tracking-[0.2em]">Hyperlocal</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-6 ml-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:tracking-[0.3em] ${
                  location.pathname === link.path 
                    ? "text-green-500" 
                    : isScrolled || location.pathname !== "/" ? "text-stone-400 hover:text-stone-900" : "text-white/60 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <span className={`hidden sm:block text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest border transition-all ${
            isScrolled || location.pathname !== "/"
              ? "text-green-600 bg-stone-50 border-green-100 shadow-sm"
              : "text-white bg-white/10 border-white/20"
          }`}>
            Priority Dispatch
          </span>

          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/cart")}
                className={`relative flex items-center gap-3 px-6 py-3 rounded-2xl transition-all active:scale-95 shadow-lg group ${
                  isScrolled || location.pathname !== "/"
                    ? "bg-stone-900 text-white shadow-stone-900/20"
                    : "bg-white text-stone-900 shadow-white/10"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-12 transition-transform"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                <span className="text-[11px] font-black uppercase tracking-widest hidden sm:block">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-4 border-white shadow-lg">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Profile/Menu Trigger */}
              <button 
                onClick={() => setMenuOpen(!menuOpen)}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-90 border overflow-hidden ${
                  isScrolled || location.pathname !== "/"
                    ? "bg-stone-50 border-stone-100 text-stone-900"
                    : "bg-white/10 border-white/20 text-white"
                }`}
              >
                {user?.profileImage ? (
                  <img src={user.profileImage} alt="" className="w-full h-full object-cover" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                )}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-6 mr-2">
                <Link
                  to="/login"
                  className={`text-[11px] font-black uppercase tracking-widest transition-colors ${
                    isScrolled || location.pathname !== "/" ? "text-stone-400 hover:text-stone-900" : "text-white/60 hover:text-white"
                  }`}
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className={`px-8 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-xl ${
                    isScrolled || location.pathname !== "/"
                      ? "bg-stone-900 text-white shadow-stone-900/20"
                      : "bg-white text-stone-900 shadow-white/10"
                  }`}
                >
                  Join
                </Link>
              </div>
              
              {/* Mobile Menu Trigger for Guests */}
              <button 
                onClick={() => setMenuOpen(!menuOpen)}
                className={`lg:hidden w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-90 border overflow-hidden ${
                  isScrolled || location.pathname !== "/"
                    ? "bg-stone-50 border-stone-100 text-stone-900"
                    : "bg-white/10 border-white/20 text-white"
                }`}
              >
                {menuOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modern Side/Mobile Menu Overlay */}
      {menuOpen && (
        <div className="absolute top-full right-6 mt-4 w-64 bg-white rounded-[2.5rem] shadow-2xl border border-stone-100 overflow-hidden transform origin-top-right transition-all animate-scale-in">
          {isLoggedIn ? (
            <div className="p-6 border-b border-stone-50 bg-stone-50/50">
              <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Signed in as</p>
              <p className="font-serif font-bold text-stone-900 truncate">{user?.name || "Member"}</p>
            </div>
          ) : (
            <div className="p-6 border-b border-stone-50 sm:hidden">
              <div className="flex flex-col gap-3">
                <Link to="/login" onClick={() => setMenuOpen(false)} className="w-full py-4 bg-stone-50 text-stone-900 rounded-2xl text-center font-black text-[10px] uppercase tracking-widest border border-stone-100">Sign In</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="w-full py-4 bg-stone-900 text-white rounded-2xl text-center font-black text-[10px] uppercase tracking-widest shadow-xl">Join Now</Link>
              </div>
            </div>
          )}
          
          <div className="p-4">
            <p className="lg:hidden text-[9px] font-black text-stone-300 uppercase tracking-widest px-4 mb-2">Navigation</p>
            <div className="lg:hidden space-y-1 mb-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all font-bold text-sm ${
                    location.pathname === link.path 
                      ? "bg-green-50 text-green-600" 
                      : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {isLoggedIn && (
              <>
                <p className="text-[9px] font-black text-stone-300 uppercase tracking-widest px-4 mb-2">Account</p>
                <Link 
                  to="/profile" 
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-all font-bold text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-4 w-full px-4 py-3.5 rounded-2xl text-rose-500 hover:bg-rose-50 transition-all font-bold text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;