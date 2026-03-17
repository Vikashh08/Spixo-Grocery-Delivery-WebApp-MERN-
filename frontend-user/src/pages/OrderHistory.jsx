import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const STATUS_CONFIG = {
  PLACED: {
    label: "Order Confirmed", 
    badge: "bg-blue-50 text-blue-600 border-blue-100",
    dot: "bg-blue-500",
    step: 1,
  },
  ASSIGNED: {
    label: "Rider Found",
    badge: "bg-amber-50 text-amber-600 border-amber-100",
    dot: "bg-amber-500",
    step: 2,
  },
  PICKED: {
    label: "Picked Up",
    badge: "bg-indigo-50 text-indigo-600 border-indigo-100",
    dot: "bg-indigo-500",
    step: 3,
  },
  ON_THE_WAY: {
    label: "On the way",
    badge: "bg-sky-50 text-sky-600 border-sky-100",
    dot: "bg-sky-500",
    step: 4,
  },
  DELIVERED: {
    label: "Delivered ✓",
    badge: "bg-emerald-50 text-emerald-600 border-emerald-100",
    dot: "bg-emerald-500",
    step: 5,
  },
  CANCELLED: {
    label: "Cancelled",
    badge: "bg-rose-50 text-rose-500 border-rose-100",
    dot: "bg-rose-400",
    step: 0,
  },
};

const STEPS = ["Confirmed", "Rider Found", "Picked Up", "On the Way", "Delivered"];

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/orders/my")
      .then((res) => setOrders(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (orderId) => {
    if (!confirm("Cancel this order?")) return;
    try {
      await api.post(`/orders/cancel/${orderId}`);
      setOrders((prev) =>
        prev.map((o) => o._id === orderId ? { ...o, status: "CANCELLED" } : o)
      );
    } catch (err) {
      alert(err.response?.data?.message || "Cannot cancel order at this stage");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-stone-200 border-t-stone-900 rounded-full animate-spin" />
          <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex flex-col items-center justify-center text-center px-6 pt-24">
        <div className="w-28 h-28 bg-white rounded-[2rem] flex items-center justify-center shadow-xl mb-8 border border-stone-100">
          <span className="text-5xl">📋</span>
        </div>
        <h2 className="text-2xl font-black text-stone-900 mb-2 tracking-tight">No orders yet</h2>
        <p className="text-stone-400 text-sm font-medium mb-10 max-w-xs leading-relaxed">
          Your order history will appear here once you place your first order.
        </p>
        <button
          onClick={() => navigate("/products")}
          className="bg-stone-900 text-white font-black text-xs uppercase tracking-widest px-10 py-4 rounded-xl hover:bg-green-600 transition-all shadow-xl active:scale-95"
        >
          Start Shopping →
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] pt-28 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-stone-400 hover:text-stone-900 transition-colors mb-4 text-[10px] font-black uppercase tracking-widest"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Home
          </button>
          <h1 className="text-2xl md:text-3xl font-black text-stone-900 tracking-tight">My Orders</h1>
          <p className="text-stone-400 text-xs font-semibold mt-1">{orders.length} order{orders.length !== 1 ? "s" : ""} placed</p>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map((order) => {
            const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PLACED;
            const isExpanded = expandedId === order._id;
            const isActive = ["PLACED","ASSIGNED","PICKED","ON_THE_WAY"].includes(order.status);
            const formattedDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
            });
            const currentStep = cfg.step;

            return (
              <div key={order._id} className={`bg-white rounded-2xl border overflow-hidden transition-all duration-300 ${isActive ? "border-stone-200 shadow-lg" : "border-stone-100 shadow-sm"}`}>
                {/* Live Order Banner */}
                {order.status === "ON_THE_WAY" && (
                  <div className="bg-sky-500 text-white px-5 py-2.5 flex items-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full animate-ping" />
                    <p className="text-[10px] font-black uppercase tracking-widest">Rider is on the way!</p>
                  </div>
                )}

                {/* Card Header */}
                <div
                  className="flex items-center justify-between p-5 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : order._id)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${order.status === "DELIVERED" ? "bg-emerald-50" : order.status === "CANCELLED" ? "bg-rose-50" : "bg-stone-50"}`}>
                      {order.status === "DELIVERED" ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                      ) : order.status === "CANCELLED" ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#78716c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 18H3c-1.1 0-2-.9-2-2V7c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v2"/><path d="M16 11h2l4 4v3h-2"/><circle cx="16.5" cy="18.5" r="2.5"/><circle cx="6.5" cy="18.5" r="2.5"/></svg>
                      )}
                    </div>
                    <div>
                      <p className="font-black text-stone-900 text-sm">#{order._id.slice(-8).toUpperCase()}</p>
                      <p className="text-stone-400 text-[10px] font-bold mt-0.5">{formattedDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                      <p className="font-black text-stone-900 text-sm">₹{order.totalAmount}</p>
                      <p className="text-stone-400 text-[10px] font-bold">{order.items?.length} items</p>
                    </div>
                    <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border flex items-center gap-1.5 ${cfg.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${isActive ? "animate-pulse" : ""}`} />
                      {cfg.label}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      className={`text-stone-300 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                    >
                      <path d="m6 9 6 6 6-6"/>
                    </svg>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-stone-50 px-5 pb-5">
                    {/* Progress Steps (not for cancelled) */}
                    {order.status !== "CANCELLED" && (
                      <div className="py-5 mb-4">
                        <div className="flex items-center justify-between relative">
                          <div className="absolute left-0 right-0 top-[14px] h-0.5 bg-stone-100 z-0" />
                          <div
                            className="absolute left-0 top-[14px] h-0.5 bg-green-500 z-0 transition-all duration-700"
                            style={{ width: `${Math.min(((currentStep - 1) / 4) * 100, 100)}%` }}
                          />
                          {STEPS.map((step, i) => (
                            <div key={step} className="flex flex-col items-center gap-2 z-10 relative">
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                                i + 1 < currentStep ? "bg-green-500" :
                                i + 1 === currentStep ? "bg-stone-900 ring-4 ring-stone-900/10" :
                                "bg-white border-2 border-stone-100"
                              }`}>
                                {i + 1 < currentStep ? (
                                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                                ) : (
                                  <span className={`text-[9px] font-black ${i + 1 === currentStep ? "text-white" : "text-stone-300"}`}>{i + 1}</span>
                                )}
                              </div>
                              <span className={`text-[9px] font-black uppercase tracking-wider whitespace-nowrap hidden sm:block ${i + 1 <= currentStep ? "text-stone-700" : "text-stone-300"}`}>
                                {step}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Items */}
                    <div className="bg-stone-50 rounded-xl overflow-hidden mb-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className={`flex items-center justify-between px-4 py-3 ${idx !== order.items.length - 1 ? "border-b border-stone-100" : ""}`}>
                          <div>
                            <p className="text-sm font-bold text-stone-800">{item.name}</p>
                            <p className="text-[10px] text-stone-400 font-medium">× {item.quantity} {item.unitQuantity ? `(${item.unitQuantity})` : ""}</p>
                          </div>
                          <p className="text-sm font-black text-stone-900">₹{item.price * item.quantity}</p>
                        </div>
                      ))}
                      <div className="flex justify-between items-center px-4 py-3 bg-stone-100/70 border-t border-stone-200">
                        <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest">Total Paid</span>
                        <span className="font-black text-stone-900">₹{order.totalAmount}</span>
                      </div>
                    </div>

                    {/* Address */}
                    {order.address && (
                      <div className="flex items-start gap-3 px-4 py-3 bg-stone-50 rounded-xl mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#78716c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                        <p className="text-xs text-stone-500 font-medium leading-relaxed">
                          {order.address.house}, {order.address.street}, {order.address.area}
                          {order.address.pincode && ` - ${order.address.pincode}`}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                      {(order.status === "PLACED" || order.status === "ASSIGNED") && (
                        <button
                          onClick={() => handleCancel(order._id)}
                          className="flex-1 py-3 bg-rose-50 text-rose-500 text-[10px] font-black uppercase tracking-widest border border-rose-100 rounded-xl hover:bg-rose-100 transition-all active:scale-95"
                        >
                          Cancel Order
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedInvoice(order)}
                        className="flex-1 py-3 bg-stone-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-green-600 transition-all shadow-lg active:scale-95"
                      >
                        View Invoice
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xl z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6">
          <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col relative animate-slide-up sm:animate-none">
            <div className="flex items-center justify-between p-6 border-b border-stone-50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-stone-900 rounded-xl flex items-center justify-center">
                  <span className="text-white font-black text-base">S</span>
                </div>
                <div>
                  <p className="font-black text-stone-900 text-sm">Spixo</p>
                  <p className="text-stone-400 text-[10px] font-bold">Tax Invoice</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="w-9 h-9 bg-stone-50 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-900 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[70vh]">
              {/* Order meta */}
              <div className="flex justify-between mb-6 pb-6 border-b border-stone-50">
                <div>
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Order ID</p>
                  <p className="font-black text-stone-900 font-mono">#{selectedInvoice._id.slice(-8).toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Date</p>
                  <p className="font-bold text-stone-900 text-sm">
                    {new Date(selectedInvoice.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
              </div>

              {/* Items */}
              <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3">Items</p>
              <div className="space-y-2 mb-6">
                {selectedInvoice.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2.5 border-b border-stone-50 last:border-0">
                    <div>
                      <p className="text-sm font-bold text-stone-800">{item.name}</p>
                      <p className="text-[10px] text-stone-400 font-medium">× {item.quantity}</p>
                    </div>
                    <p className="text-sm font-black text-stone-900">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="bg-stone-50 rounded-2xl p-4 space-y-2.5 mb-6">
                <div className="flex justify-between text-xs font-bold text-stone-500">
                  <span>Subtotal</span>
                  <span>₹{selectedInvoice.subtotal || selectedInvoice.totalAmount}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-stone-500">
                  <span>Delivery Fee</span>
                  <span className={selectedInvoice.deliveryCharge === 0 ? "text-green-600" : ""}>
                    {selectedInvoice.deliveryCharge === 0 ? "Free" : `₹${selectedInvoice.deliveryCharge || 0}`}
                  </span>
                </div>
                <div className="flex justify-between pt-2.5 border-t border-stone-200 items-baseline">
                  <span className="text-xs font-black text-stone-900 uppercase tracking-widest">Total</span>
                  <span className="text-2xl font-black text-stone-900">₹{selectedInvoice.totalAmount}</span>
                </div>
              </div>

              {/* Delivery address */}
              {selectedInvoice.address && (
                <div className="mb-6">
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Delivered to</p>
                  <p className="text-xs text-stone-600 font-medium leading-relaxed">
                    {selectedInvoice.address.house}, {selectedInvoice.address.street},
                    {selectedInvoice.address.area}{selectedInvoice.address.pincode && ` - ${selectedInvoice.address.pincode}`}
                  </p>
                </div>
              )}

              <button
                onClick={() => window.print()}
                className="w-full flex items-center justify-center gap-2 border-2 border-stone-100 text-stone-500 hover:bg-stone-50 text-[10px] font-black uppercase tracking-widest py-3 rounded-xl transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderHistory;
