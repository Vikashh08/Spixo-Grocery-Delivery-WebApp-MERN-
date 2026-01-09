import { useState } from "react";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function UserLogin() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const { login } = useAuth();
  const navigate = useNavigate();

  const sendOtp = async () => {
    await api.post("/auth/send-otp", {
      identifier: email,
      role: "USER"
    });
    setStep(2);
  };

  const verifyOtp = async () => {
    const res = await api.post("/auth/verify-otp", {
      identifier: email,
      otp,
      role: "USER"
    });
    login(res.data.token);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl w-80">
        {step === 1 ? (
          <>
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border w-full p-2 mb-4"
            />
            <button onClick={sendOtp} className="w-full bg-black text-white p-2">
              Send OTP
            </button>
          </>
        ) : (
          <>
            <input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="border w-full p-2 mb-4"
            />
            <button onClick={verifyOtp} className="w-full bg-black text-white p-2">
              Verify OTP
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default UserLogin;
