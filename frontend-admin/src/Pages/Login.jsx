import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { AiOutlineLock, AiOutlineMail } from "react-icons/ai";
import "../index.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Try a few common admin login endpoints in case the API path differs
      const endpoints = ["/admin/login", "/admin/auth/login", "/auth/admin/login", "/admin"];
      let res = null;

      for (const ep of endpoints) {
        try {
          res = await api.post(ep, { email, password });
          // stop if we got a response that likely contains a token
          if (res && (res.data?.token || res.data?.data?.token)) break;
        } catch (err) {
          // try next endpoint
        }
      }

      if (!res) throw new Error("Login failed");

      // Support multiple response shapes: { token } or { data: { token } }
      const token = res.data?.token || res.data?.data?.token;
      if (!token) throw new Error("No token returned from server");

      // Store admin token
      localStorage.setItem("adminToken", token);

      // Optionally set the Authorization header on the api instance for future requests
      if (api && api.defaults && api.defaults.headers) {
        api.defaults.headers.common = api.defaults.headers.common || {};
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      // Redirect to admin dashboard
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      alert("Invalid administrative credentials or server error.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-900 px-6 font-sans">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleLogin}
          className="bg-white rounded-[3rem] p-10 md:p-14 shadow-2xl overflow-hidden relative"
        >
          {/* Decorative Admin Accent */}
          <div className="absolute top-0 left-0 w-full h-2 bg-stone-800"></div>

          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif font-bold text-stone-800 tracking-tight">
              Spixo Control
            </h2>
            <p className="text-stone-400 mt-2 text-xs font-bold uppercase tracking-[0.2em]">
              Authorized Personnel Only
            </p>
          </div>

          <div className="space-y-6">
            <div className="relative">
              <AiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" />
              <input
                type="email"
                placeholder="Admin Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-stone-50 rounded-2xl outline-none"
                required
              />
            </div>

            <div className="relative">
              <AiOutlineLock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" />
              <input
                type="password"
                placeholder="Secret Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-stone-50 rounded-2xl outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-5 bg-stone-900 text-white font-bold rounded-2xl hover:bg-stone-800 transition-all active:scale-[0.98]"
            >
              Access Dashboard
            </button>
          </div>

          <p className="mt-10 text-center text-stone-300 text-[10px] font-bold uppercase tracking-widest">
            Spixo Systems v1.0 • Secure Encryption Active
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
