import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import api from "../api/api";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });
  const navigate = useNavigate(); // Initialize navigate

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/register", form);
      alert(res.data.message);
      navigate("/login"); // After successful register, go to login
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfcfb] py-12 px-4 font-sans relative">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-stone-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg">
        <form 
          onSubmit={handleSubmit} 
          className="bg-white/80 backdrop-blur-lg border border-stone-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] p-8 md:p-12"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif font-semibold text-stone-800 tracking-tight">
              Create <span className="text-red-600">Account</span>
            </h2>
            <p className="text-stone-500 mt-2 text-sm font-medium uppercase tracking-widest">
              From our store to your home.
            </p>
          </div>

          <div className="space-y-4">
            {/* Field mapping for Name, Email, Password, Phone, Address */}
            {["name", "email", "password", "phone", "address"].map((field) => (
              <div key={field}>
                <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-1.5 ml-1">
                  {field}
                </label>
                <input
                  name={field}
                  type={field === "password" ? "password" : "text"}
                  placeholder={`Enter your ${field}`}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 bg-stone-50 border-none rounded-2xl text-stone-800 focus:ring-2 focus:ring-emerald-600/20 outline-none transition-all"
                  required
                />
              </div>
            ))}

            <button
              type="submit"
              className="w-full mt-4 py-4 bg-stone-900 hover:bg-emerald-800 text-white font-semibold rounded-2xl shadow-lg transition-all active:scale-[0.98]"
            >
              Create Account
            </button>
          </div>

          <div className="mt-8 text-center border-t border-stone-100 pt-6">
            <p className="text-stone-400 text-sm">
              Already have an account?{" "}
              <button 
                type="button" 
                onClick={() => navigate("/login")} // Navigate to Login
                className="text-emerald-700 font-bold hover:underline underline-offset-4"
              >
                Sign In
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;