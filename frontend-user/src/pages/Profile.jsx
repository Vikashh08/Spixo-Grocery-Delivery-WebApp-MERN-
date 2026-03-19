import { useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ house: "", street: "", area: "", pincode: "", isDefault: false });
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const res = await api.get("/user/profile");
      setProfile(res.data);
    } catch (err) {
      console.error("Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await api.post("/user/address", newAddress);
      setShowAddressForm(false);
      setNewAddress({ house: "", street: "", area: "", pincode: "", isDefault: false });
      fetchProfile();
    } catch (err) {
      alert("Failed to add address");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="bg-[#fcfaf8] min-h-screen pt-32 px-6 pb-32">
      <div className="max-w-4xl mx-auto mb-12 flex items-end justify-between gap-8">
        <div>
          <p className="text-green-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4">Member Profile</p>
          <h1 className="text-5xl font-serif font-bold text-stone-900 tracking-tight">Your Account</h1>
        </div>
        <button 
          onClick={() => { logout(); navigate("/login"); }}
          className="bg-white border border-stone-100 text-rose-500 font-serif font-bold px-8 py-4 rounded-2xl hover:bg-rose-50 hover:border-rose-100 transition-all shadow-xl shadow-stone-200/50"
        >
          Sign Out
        </button>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* User Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl font-black">
            {profile?.name?.[0].toUpperCase() || "U"}
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900">{profile?.name}</h2>
            <p className="text-gray-400 text-sm font-medium">{profile?.email}</p>
            <p className="text-gray-400 text-sm font-medium">{profile?.phone}</p>
          </div>
        </div>

        {/* Addresses Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-serif font-bold text-stone-900">Saved Addresses</h3>
            <button 
              onClick={() => setShowAddressForm(true)}
              className="bg-stone-900 text-white font-serif font-bold px-6 py-3 rounded-xl hover:bg-green-500 transition-all shadow-xl shadow-stone-900/10"
            >
              Add New
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {profile?.addresses?.length === 0 ? (
              <div className="md:col-span-2 bg-white rounded-[2.5rem] p-12 text-center border-2 border-dashed border-stone-100">
                <p className="text-stone-400 font-medium italic">No saved addresses yet. Add one for a faster checkout.</p>
              </div>
            ) : (
              profile?.addresses?.map((addr, i) => (
                <div key={i} className="bg-white rounded-[2rem] p-6 shadow-xl shadow-stone-200/30 border border-stone-50 flex gap-4 hover:border-green-100 transition-all group">
                  <div className="w-12 h-12 bg-stone-50 rounded-xl flex items-center justify-center text-stone-300 group-hover:bg-green-50 group-hover:text-green-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                  <div>
                    <p className="font-bold text-stone-900 text-lg mb-1">
                      {addr.house}, {addr.street}
                    </p>
                    <p className="text-stone-400 text-sm font-medium">
                      {addr.area}, {addr.pincode}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Address Form Modal/Overlay */}
        {showAddressForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 animate-slide-up">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-gray-900">Add Address</h3>
                <button onClick={() => setShowAddressForm(false)} className="text-gray-400 text-2xl">×</button>
              </div>

              <form onSubmit={handleAddAddress} className="space-y-4">
                <input 
                  placeholder="House / Flat No.*" 
                  required
                  value={newAddress.house}
                  onChange={e => setNewAddress({...newAddress, house: e.target.value})}
                  className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-green-100"
                />
                <input 
                  placeholder="Street Name*" 
                  required
                  value={newAddress.street}
                  onChange={e => setNewAddress({...newAddress, street: e.target.value})}
                  className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-green-100"
                />
                <input 
                  placeholder="Area / Locality*" 
                  required
                  value={newAddress.area}
                  onChange={e => setNewAddress({...newAddress, area: e.target.value})}
                  className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-green-100"
                />
                <input 
                  placeholder="Pincode*" 
                  required
                  value={newAddress.pincode}
                  onChange={e => setNewAddress({...newAddress, pincode: e.target.value})}
                  className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-green-100"
                />
                
                <button 
                  type="submit"
                  className="w-full bg-green-500 text-white font-black py-4 rounded-2xl mt-2 text-lg shadow-lg shadow-green-100"
                >
                  Save Address
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">          {[
            { label: "My Orders", path: "/orders", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M2 7v13a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7"/><path d="M2 7h20"/><path d="M15 22V12H9v10"/></svg> },
            { label: "Support", path: "/contact", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg> },
            { label: "Settings", path: "#", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg> },
          ]
].map(link => (
            <button 
              key={link.label}
              onClick={() => link.path !== "#" && navigate(link.path)}
              className="bg-white rounded-[2rem] p-6 flex flex-col items-center justify-center gap-4 border border-stone-50 hover:border-green-100 transition-all shadow-xl shadow-stone-200/30 group"
            >
              <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center text-stone-400 group-hover:bg-stone-900 group-hover:text-white transition-all">
                {link.icon}
              </div>
              <span className="font-serif font-bold text-stone-900">{link.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Profile;
