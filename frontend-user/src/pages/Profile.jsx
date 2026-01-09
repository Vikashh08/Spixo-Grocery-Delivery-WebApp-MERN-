import { useEffect, useState } from "react";
import api from "../api/api";

function Profile() {
  const [profile, setProfile] = useState({});
  const [address, setAddress] = useState({ label: "", area: "", pincode: "" });

  useEffect(() => {
    api.get("/user/profile").then(res => setProfile(res.data));
  }, []);

  const saveAddress = async () => {
    await api.post("/user/address", address);
    alert("Address saved");
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>

      <p>Email: {profile.email}</p>

      <h3 className="mt-6 font-bold">Add Address</h3>

      <input placeholder="Label" onChange={e => setAddress({ ...address, label: e.target.value })} className="border p-2 w-full mb-2" />
      <input placeholder="Area" onChange={e => setAddress({ ...address, area: e.target.value })} className="border p-2 w-full mb-2" />
      <input placeholder="Pincode" onChange={e => setAddress({ ...address, pincode: e.target.value })} className="border p-2 w-full mb-2" />

      <button onClick={saveAddress} className="bg-black text-white p-2 w-full">
        Save Address
      </button>
    </div>
  );
}

export default Profile;
