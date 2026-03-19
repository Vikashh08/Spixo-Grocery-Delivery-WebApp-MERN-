import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { AiOutlineArrowLeft, AiOutlineEdit, AiOutlineDelete, AiOutlinePlus, AiOutlineSearch, AiOutlineInbox } from "react-icons/ai";

function ManageProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchProducts = () => {
    api
      .get("/products/admin")
      .then((res) => setProducts(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id, name) => {
    if (!window.confirm(`Permanently remove "${name}" from catalog?`)) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch {
      alert("Removal failed. Verify permissions.");
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#fcfaf8] min-h-screen py-10 px-6 font-sans selection:bg-stone-200">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation */}
        <button
          onClick={() => navigate("/")}
          className="text-stone-400 hover:text-stone-800 mb-8 flex items-center gap-2 font-bold text-xs tracking-widest transition-colors uppercase"
        >
          <AiOutlineArrowLeft /> ADMIN DASHBOARD
        </button>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <h2 className="text-4xl font-serif font-bold text-stone-800 tracking-tight">Manage Products</h2>
            <p className="text-stone-400 text-xs font-bold uppercase tracking-[0.2em] mt-2">View and manage all your products</p>
          </div>
          <button
            onClick={() => navigate("/add-product")}
            className="flex items-center gap-2 bg-stone-900 text-white font-black px-8 py-4 rounded-[1.5rem] hover:bg-stone-800 transition-all text-xs uppercase tracking-widest shadow-2xl shadow-stone-200 active:scale-95"
          >
            <AiOutlinePlus size={16} /> Add New Product
          </button>
        </div>

        {/* Global Search Bar */}
        <div className="relative mb-10 group">
          <AiOutlineSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-stone-800 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search products by name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-14 pr-7 py-5 bg-white border border-stone-100 rounded-3xl outline-none text-stone-700 shadow-sm focus:ring-4 focus:ring-stone-400/5 transition-all font-medium"
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-44 bg-white border border-stone-100 rounded-[2rem] animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-32 bg-white border border-stone-100 rounded-[3rem] shadow-sm">
             <AiOutlineInbox className="mx-auto text-stone-200 mb-4" size={48} />
             <p className="text-stone-300 font-serif text-xl italic">"No products found."</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product) => (
              <div
                key={product._id}
                className="bg-white border border-stone-100 rounded-[2.5rem] p-6 flex flex-col shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
              >
                {/* Product Meta */}
                <div className="flex items-start gap-4 mb-6">
                   <div className="w-20 h-20 bg-stone-50 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden border border-stone-100 group-hover:scale-105 transition-transform duration-500 shadow-inner">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.opacity = "0"; }}
                        />
                      ) : (
                        <span className="text-2xl font-serif font-black text-stone-200">{product.name[0]}</span>
                      )}
                   </div>
                   <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">{product.category}</p>
                      <h3 className="font-bold text-stone-800 text-lg leading-tight truncate">{product.name}</h3>
                      <p className="text-[11px] text-stone-400 font-medium mt-1 uppercase tracking-tighter">Sold as: {product.unit}</p>
                   </div>
                </div>

                {/* Valuation & Stock */}
                <div className="flex items-end justify-between px-1 mb-6">
                  <div>
                    <label className="text-[10px] font-black text-stone-300 uppercase tracking-widest block mb-0.5">Price</label>
                    <p className="font-serif font-bold text-emerald-800 text-2xl tracking-tighter">
                      ₹{product.price}
                      {product.unitQuantity && <span className="text-sm text-emerald-600/70 font-sans ml-1 tracking-normal">/ {product.unitQuantity}</span>}
                    </p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                     <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider ${
                        product.isAvailable ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-red-50 text-red-500 border border-red-100"
                     }`}>
                        {product.isAvailable ? `In Stock: ${product.stock}` : "Sold Out"}
                     </span>
                     {product.isAvailable && (
                        <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mt-1">
                          Limit: {product.minOrderQuantity || 1} - {product.maxOrderQuantity || 10}
                        </span>
                     )}
                  </div>
                </div>

                {/* Action Bar */}
                <div className="mt-auto pt-6 border-t border-stone-50 flex gap-3">
                   <button
                    onClick={() => navigate("/add-product", { state: { product } })}
                    className="flex-1 bg-stone-50 hover:bg-stone-900 hover:text-white text-stone-600 py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all font-black text-[10px] uppercase tracking-widest"
                  >
                    <AiOutlineEdit size={14} /> Edit Product
                  </button>
                  <button
                    onClick={() => deleteProduct(product._id, product.name)}
                    className="aspect-square bg-red-50 hover:bg-red-500 hover:text-white text-red-500 w-12 rounded-2xl flex items-center justify-center transition-all shadow-sm"
                  >
                    <AiOutlineDelete size={18} />
                  </button>
                </div>

                {/* Offer Badge */}
                {product.discount > 0 && (
                   <div className="absolute top-4 right-4 bg-orange-500 text-white text-[9px] font-black px-2.5 py-1.5 rounded-xl shadow-lg transform rotate-2">
                       -{product.discount}%
                   </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageProducts;
