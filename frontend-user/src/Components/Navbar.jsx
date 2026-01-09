import { useState } from "react";
import { AiOutlineShoppingCart, AiOutlineSearch } from "react-icons/ai";
import { RxPerson } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import logo from '../assets/logo.png';

function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartItems } = useCart() || { cartItems: [] };
  const { isLoggedIn, logout } = useAuth() || { isLoggedIn: false };
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${searchQuery}`);
    } else {
      navigate("/products");
    }
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-100 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center text-2xl font-serif font-bold text-stone-800 tracking-tight shrink-0">
          <img src={logo} alt="Spixo Logo" className="inline-block w-8 h-8 mr-2" />
          <span className="text-red-600">Spixo</span>
        </Link>

        {/* Search Bar (desktop) */}
        <form onSubmit={handleSearch} className="relative flex-1 max-w-xl mx-4 hidden md:block">
          <button type="submit" className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-emerald-700 transition-colors">
            <AiOutlineSearch size={20} />
          </button>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for organic kale, fresh milk..."
            className="w-full bg-stone-50 border border-stone-100 px-12 py-2.5 rounded-full text-sm outline-none focus:ring-4 focus:ring-emerald-700/5 focus:bg-white focus:border-emerald-700/20 transition-all duration-300 placeholder:text-stone-300"
          />
        </form>

        {/* Actions */}
        <div className="flex items-center gap-4 shrink-0">
          <Link to="/products" className="text-sm font-semibold text-stone-600 hover:text-emerald-700 hidden sm:block hover:border-b hover:bg-red-100 p-2 rounded-2xl">
            Shop
          </Link>

          {!isLoggedIn ? (
            <Link to="/login" className="items-center gap-2 text-sm font-semibold text-stone-600 hover:text-emerald-700 hover:border-b hover:bg-red-100 p-2 rounded-2xl hidden lg:flex">
              <RxPerson size={18} /> <span className="hidden lg:inline">Sign In</span>
            </Link>
          ) : (
            <div className="hidden lg:flex items-center gap-6">
              <Link to="/orders" className="text-sm font-semibold text-stone-600 hover:text-emerald-700 hover:border-b hover:bg-red-100 p-2 rounded-2xl">My Orders</Link>
              <button
                onClick={handleLogout}
                className="text-xs font-bold text-red-600 uppercase tracking-tighter hover:text-red-600 transition-colors cursor-pointer hover:border-b hover:bg-red-100 p-2 rounded-2xl"
              >
                Logout
              </button>
            </div>
          )}

          {/* Cart */}
          <Link to="/cart" className="relative p-2.5 bg-stone-50 rounded-full hover:bg-stone-100 transition-all group" onClick={() => setMobileMenuOpen(false)}>
            <AiOutlineShoppingCart size={22} className="text-stone-700 group-hover:text-emerald-800" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-700 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                {cartItems.length}
              </span>
            )}
          </Link>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="md:hidden p-2.5 rounded-full bg-stone-50 hover:bg-stone-100"
            onClick={() => setMobileMenuOpen((s) => !s)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-stone-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-stone-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu contents (links + auth + cart) */}
      {mobileMenuOpen && (
        <div className="md:hidden px-6 pb-4 border-t border-stone-100 bg-white/80 backdrop-blur-md">
          <div className="flex flex-col gap-3">
            <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-stone-700 p-3 rounded-lg hover:bg-stone-50">
              Shop
            </Link>

            {!isLoggedIn ? (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-sm font-semibold text-stone-700 p-3 rounded-lg hover:bg-stone-50">
                <RxPerson size={18} /> Sign In
              </Link>
            ) : (
              <>
                <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-stone-700 p-3 rounded-lg hover:bg-stone-50">
                  My Orders
                </Link>
                <button onClick={handleLogout} className="text-sm font-semibold text-red-600 text-left p-3 rounded-lg hover:bg-stone-50">
                  Logout
                </button>
              </>
            )}

            <Link to="/cart" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between gap-2 text-sm font-semibold text-stone-700 p-3 rounded-lg hover:bg-stone-50">
              <div className="flex items-center gap-2">
                <AiOutlineShoppingCart size={18} /> Cart
              </div>
              {cartItems.length > 0 && (
                <span className="bg-emerald-700 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      )}

      {/* Mobile Search Bar Submission */}
      <form onSubmit={handleSearch} className="md:hidden px-6 pb-4">
        <div className="relative w-full">
          <button type="submit" className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
            <AiOutlineSearch size={18} />
          </button>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-stone-50 border border-stone-100 px-10 py-2 rounded-2xl text-sm outline-none"
          />
        </div>
      </form>
    </nav>
  );
}

export default Navbar;