import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/api";
import { AiOutlineArrowLeft, AiOutlineCloudUpload, AiOutlineTag, AiOutlineDatabase, AiOutlineInfoCircle } from "react-icons/ai";

const CATEGORIES = [
  "Fruits & Veggies", "Dairy & Eggs", "Bread & Bakery",
  "Beverages", "Snacks", "Personal Care", "Cleaning", "Dry Fruits", "Other"
];

const UNITS = [
  { label: "Unit (Piece)", value: "unit" },
  { label: "Weight (Kg)", value: "kg" },
  { label: "Volume (Litre)", value: "litre" },
  { label: "Packet (Pkt)", value: "pack" },
  { label: "Dozen (Dz)", value: "dozen" }
];

function AddProduct() {
  const navigate = useNavigate();
  const location = useLocation();
  const editProduct = location.state?.product || null;

  const [form, setForm] = useState({
    name: editProduct?.name || "",
    description: editProduct?.description || "",
    price: editProduct?.price || "",
    stock: editProduct?.stock || "",
    unit: editProduct?.unit || "unit",
    unitQuantity: editProduct?.unitQuantity || "",
    category: editProduct?.category || "",
    discount: editProduct?.discount || "",
    image: editProduct?.image || "",
    minOrderQuantity: editProduct?.minOrderQuantity || 1,
    maxOrderQuantity: editProduct?.maxOrderQuantity || 10,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const priceVal = parseFloat(form.price);
      const discountVal = parseFloat(form.discount) || 0;
      const stockVal = parseInt(form.stock) || 0;
      const minQtyVal = parseInt(form.minOrderQuantity) || 1;
      const maxQtyVal = parseInt(form.maxOrderQuantity) || 10;

      if (isNaN(priceVal)) {
        throw new Error("Base Price must be a valid numeric value.");
      }

      if (maxQtyVal > stockVal) {
        throw new Error(`Maximum order quantity (${maxQtyVal}) cannot exceed available stock (${stockVal}).`);
      }

      if (minQtyVal > maxQtyVal) {
        throw new Error(`Minimum order quantity (${minQtyVal}) cannot exceed maximum order quantity (${maxQtyVal}).`);
      }

      const payload = {
        ...form,
        price: priceVal,
        stock: stockVal,
        discount: discountVal,
        minOrderQuantity: minQtyVal,
        maxOrderQuantity: maxQtyVal,
      };

      if (editProduct) {
        await api.put(`/products/${editProduct._id}`, payload);
      } else {
        await api.post("/products", payload);
      }
      navigate("/products");
    } catch (err) {
      console.error("Product submit error:", err);
      setError(err.response?.data?.message || err.message || "Operation failed. Verify numeric fields.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#fcfaf8] min-h-screen py-12 px-6 font-sans">
      <div className="max-w-4xl mx-auto">
        
        <button
          onClick={() => navigate("/products")}
          className="text-stone-400 hover:text-stone-800 mb-10 flex items-center gap-2 font-bold text-xs tracking-widest transition-colors"
        >
          <AiOutlineArrowLeft /> MANAGE PRODUCTS
        </button>

        <div className="bg-white border border-stone-100 rounded-[3rem] shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-stone-900 px-10 py-12 text-white relative">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
             <h2 className="text-4xl font-serif font-bold tracking-tight mb-2 relative z-10">
                {editProduct ? "Edit Product" : "Add Product"}
             </h2>
             <p className="text-stone-400 text-xs font-black uppercase tracking-[0.2em] relative z-10">
                Product Details
             </p>
          </div>

          <form onSubmit={submit} className="p-10 md:p-14 space-y-12">
            
            {/* Identity Section */}
            <section>
              <div className="flex items-center gap-2 mb-6 text-stone-800">
                 <AiOutlineInfoCircle size={18} />
                 <h3 className="font-bold text-lg">Basic Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="group">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-2 group-focus-within:text-stone-800 transition-colors">Product Name *</label>
                  <input
                    name="name"
                    value={form.name}
                    placeholder="e.g. Organic Hass Avocado"
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 bg-stone-50 border border-stone-50 rounded-2xl outline-none text-stone-800 font-medium focus:bg-white focus:border-stone-200 focus:ring-4 focus:ring-stone-50 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-2">Category *</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 bg-stone-50 border border-stone-50 rounded-2xl outline-none text-stone-800 font-bold focus:bg-white focus:border-stone-200 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select segment</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-2">Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    placeholder="Provide detailed product specifications, nutritional info, or origin..."
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-6 py-4 bg-stone-50 border border-stone-50 rounded-2xl outline-none text-stone-800 font-medium focus:bg-white focus:border-stone-200 transition-all resize-none"
                  />
                </div>
              </div>
            </section>

            {/* Inventory Section */}
            <section>
               <div className="flex items-center gap-2 mb-6 text-stone-800">
                 <AiOutlineDatabase size={18} />
                 <h3 className="font-bold text-lg">Stock & Quantity</h3>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-2">Unit of Measurement</label>
                    <select
                      name="unit"
                      value={form.unit}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-stone-50 border border-stone-50 rounded-2xl outline-none text-stone-800 font-bold focus:bg-white focus:border-stone-200 transition-all cursor-pointer"
                    >
                      {UNITS.map((u) => (
                        <option key={u.value} value={u.value}>{u.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-2">Quantity / Size</label>
                    <input
                      name="unitQuantity"
                      type="text"
                      value={form.unitQuantity}
                      placeholder="e.g. 500g, 1L, 1 pc"
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-stone-50 border border-stone-50 rounded-2xl outline-none text-stone-800 font-bold focus:bg-white focus:border-stone-200 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-2">Initial Stock *</label>
                    <input
                      name="stock"
                      type="number"
                      min="0"
                      value={form.stock}
                      placeholder="Units available for dispatch"
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-4 bg-stone-50 border border-stone-50 rounded-2xl outline-none text-stone-800 font-bold focus:bg-white focus:border-stone-200 transition-all"
                    />
                  </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                  <div>
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-2">Min Order Quantity</label>
                    <input
                      name="minOrderQuantity"
                      type="number"
                      min="1"
                      value={form.minOrderQuantity}
                      placeholder="e.g. 1"
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-stone-50 border border-stone-50 rounded-2xl outline-none text-stone-800 font-bold focus:bg-white focus:border-stone-200 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-2">Max Order Quantity (Limit)</label>
                    <input
                      name="maxOrderQuantity"
                      type="number"
                      min="1"
                      value={form.maxOrderQuantity}
                      placeholder="Must be ≤ Stock"
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-stone-50 border border-stone-50 rounded-2xl outline-none text-stone-800 font-bold focus:bg-white focus:border-stone-200 transition-all"
                    />
                  </div>
               </div>
            </section>

            {/* Valuation Section */}
            <section>
               <div className="flex items-center gap-2 mb-6 text-stone-800">
                 <AiOutlineTag size={18} />
                 <h3 className="font-bold text-lg">Pricing</h3>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-emerald-50/30 rounded-[2rem] border border-emerald-50">
                  <div>
                    <label className="text-[10px] font-black text-emerald-800/40 uppercase tracking-widest block mb-2">Price (₹) *</label>
                    <input
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.price}
                      placeholder="0.00"
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-4 bg-white border border-emerald-100 rounded-2xl outline-none text-stone-800 font-black focus:ring-4 focus:ring-emerald-500/10 transition-all lg:text-xl"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-emerald-800/40 uppercase tracking-widest block mb-2">Discount (%)</label>
                    <input
                      name="discount"
                      type="number"
                      min="0"
                      max="100"
                      value={form.discount}
                      placeholder="0"
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-white border border-emerald-100 rounded-2xl outline-none text-orange-600 font-black focus:ring-4 focus:ring-orange-500/10 transition-all lg:text-xl"
                    />
                  </div>
               </div>
            </section>

            {/* Assets Section */}
            <section>
               <div className="flex items-center gap-2 mb-6 text-stone-800">
                 <AiOutlineCloudUpload size={18} />
                 <h3 className="font-bold text-lg">Product Image</h3>
               </div>
               <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="flex-1 w-full">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-2">Image URL</label>
                    <input
                      name="image"
                      value={form.image}
                      placeholder="https://images.spixo.com/products/..."
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-stone-50 border border-stone-50 rounded-2xl outline-none text-stone-800 font-medium focus:bg-white focus:border-stone-200 transition-all text-xs"
                    />
                  </div>
                  {form.image && (
                    <div className="shrink-0">
                       <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Live Preview</p>
                       <div className="w-24 h-24 rounded-2xl border-2 border-stone-100 p-1 bg-white shadow-xl">
                          <img
                            src={form.image}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-xl"
                            onError={(e) => { e.target.style.opacity = "0"; }}
                          />
                       </div>
                    </div>
                  )}
               </div>
            </section>

            {error && (
              <div className="bg-red-50 text-red-600 text-xs font-bold px-6 py-4 rounded-2xl border border-red-100 flex items-center gap-2">
                 <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>
                 {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-10">
               <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-5 bg-stone-900 text-white font-black text-sm uppercase tracking-widest rounded-3xl hover:bg-stone-800 transition-all shadow-xl shadow-stone-200 disabled:opacity-50 active:scale-95"
                >
                  {loading ? "Saving..." : editProduct ? "Save Changes" : "Save Product"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/products")}
                  className="px-10 py-5 bg-white text-stone-400 font-bold text-sm uppercase tracking-widest rounded-3xl border border-stone-100 hover:text-stone-800 transition-all active:scale-95"
                >
                  Cancel
                </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;