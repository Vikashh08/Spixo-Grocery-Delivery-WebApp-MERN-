import { useState } from "react";
import {
AiOutlineMail,
AiOutlinePhone,
AiOutlineMessage,
AiOutlineArrowRight,
AiOutlineClockCircle,
} from "react-icons/ai";
import api from "../api/api";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Contact() {
const { user } = useAuth();
const navigate = useNavigate();

const [formData, setFormData] = useState({
name: user?.name || "",
email: user?.email || "",
reason: "Order Inquiry",
message: "",
});

const [loading, setLoading] = useState(false);
const [submitted, setSubmitted] = useState(false);

const handleSubmit = async (e) => {
e.preventDefault();
setLoading(true);

try {
await api.post("/contact", {
...formData,
userId: user?._id,
});

setSubmitted(true);

setFormData({
name: user?.name || "",
email: user?.email || "",
reason: "Order Inquiry",
message: "",
});

toast.success("Support request sent");
} catch {
toast.error("Failed to send request");
} finally {
setLoading(false);
}
};

return (

<div className="bg-stone-50 min-h-screen pt-28 pb-20 px-5">
<div className="max-w-6xl mx-auto">
<div className="grid lg:grid-cols-12 gap-10">

{/* LEFT */}

<div className="lg:col-span-5 space-y-8">
<h1 className="text-3xl font-bold text-stone-900 leading-tight">
Need help with your order?
</h1>

<p className="text-stone-500 text-sm">
Our support team is available 24×7 to assist you.
</p>

{user && (
<button
onClick={() => navigate("/my-support")}
className="bg-emerald-500 text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-emerald-600 transition flex items-center gap-2"

>

Track Support <AiOutlineArrowRight /> </button>
)}

<div className="space-y-3 pt-4">
{[
{ icon: <AiOutlineMail />, title: "Email", value: "vikashwork6@gmail.com" },
{ icon: <AiOutlinePhone />, title: "Phone", value: "+91 6204229636" },
{ icon: <AiOutlineMessage />, title: "Chat", value: "In-App Support" },
].map((item, i) => (
<div
key={i}
className="bg-white p-4 rounded-xl border border-stone-200 flex items-center gap-4"
>
<div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center">
{item.icon}
</div>

<div>
<p className="text-xs text-stone-400">{item.title}</p>
<p className="text-sm font-semibold text-stone-800">
{item.value}
</p>
</div>
</div>
))}
</div>
</div>

{/* RIGHT */}

<div className="lg:col-span-7 bg-white rounded-3xl p-7 md:p-9 shadow-sm border border-stone-200 relative overflow-hidden">

<div className="mb-6 flex justify-between">
<div>
<h2 className="text-xl font-bold text-stone-900">
Contact Support
</h2>
<p className="text-xs text-stone-400">
Avg response ~15 min
</p>
</div>

<AiOutlineClockCircle className="text-emerald-500 text-xl" />
</div>

<form onSubmit={handleSubmit} className="space-y-5">
<div className="grid md:grid-cols-2 gap-4">
<input
required
value={formData.name}
onChange={(e) =>
setFormData({ ...formData, name: e.target.value })
}
className="input"
placeholder="Full Name"
/>

<input
required
type="email"
value={formData.email}
onChange={(e) =>
setFormData({ ...formData, email: e.target.value })
}
className="input"
placeholder="Email Address"
/>

</div>

<select
value={formData.reason}
onChange={(e) =>
setFormData({ ...formData, reason: e.target.value })
}
className="input text-sm"

>

<option>Order Inquiry</option>
<option>Delivery Feedback</option>
<option>Product Suggestion</option>
<option>Technical Issue</option>
<option>Business Partnership</option>
</select>

<textarea
required
rows="4"
value={formData.message}
onChange={(e) =>
setFormData({ ...formData, message: e.target.value })
}
className="input resize-none"
placeholder="Tell us how we can help..."
/>

<button
disabled={loading}
className="w-full bg-emerald-500 text-white p-4 rounded-xl font-semibold text-sm hover:bg-emerald-600 transition active:scale-95 flex items-center justify-center gap-2"
>
{loading ? <div className="loader" /> : <>Send Request <AiOutlineArrowRight /></>}
</button>
</form>

{/* SUCCESS SHEET */}
{submitted && (
<div className="absolute inset-0 flex items-end justify-center bg-black/20 backdrop-blur-sm z-20">

{/* CONFETTI */}
<div className="confetti-wrapper">
{[...Array(40)].map((_, i) => (
<span key={i} className="confetti" />
))}
</div>

<div className="success-sheet w-full bg-white rounded-t-[32px] p-8 text-center shadow-2xl">
<div className="success-icon">
<svg width="44" height="44" viewBox="0 0 24 24">
<path
d="M5 13L9 17L19 7"
stroke="#10B981"
strokeWidth="3"
fill="none"
strokeLinecap="round"
strokeLinejoin="round"
/>
</svg>
</div>

<h3 className="text-2xl font-bold text-stone-900 mb-2">
Request Sent 🎉
</h3>

<p className="text-stone-500 text-sm mb-7">
Our support team will contact you shortly.
</p>

<button
onClick={() => setSubmitted(false)}
className="w-full bg-emerald-500 text-white py-4 rounded-xl font-semibold text-sm hover:bg-emerald-600 transition active:scale-95"
>
Continue
</button>
</div>
</div>
)}

</div>
</div>

<style>{`
.input{
width:100%;
background:white;
border:1px solid #e7e5e4;
padding:14px 16px;
border-radius:12px;
font-size:14px;
transition:.25s;
}
.input:focus{
border-color:#10b981;
box-shadow:0 0 0 4px rgba(16,185,129,.12);
}

.loader{
width:18px;
height:18px;
border:2px solid rgba(255,255,255,.4);
border-top:2px solid white;
border-radius:50%;
animation:spin .7s linear infinite;
}
@keyframes spin{
to{transform:rotate(360deg);}
}

/* sheet animation */
.success-sheet{
animation:sheetUp .55s cubic-bezier(.22,1,.36,1);
}
@keyframes sheetUp{
from{transform:translateY(100%);}
to{transform:translateY(0);}
}

/* icon pop */
.success-icon{
width:82px;
height:82px;
background:#d1fae5;
border-radius:999px;
display:flex;
align-items:center;
justify-content:center;
margin:0 auto 20px;
animation:pop .45s ease;
}
@keyframes pop{
from{transform:scale(.6);opacity:0;}
to{transform:scale(1);opacity:1;}
}

/* CONFETTI */
.confetti-wrapper{
position:absolute;
inset:0;
pointer-events:none;
overflow:hidden;
}

.confetti{
position:absolute;
width:8px;
height:14px;
top:-20px;
background:#10b981;
opacity:.9;
border-radius:2px;
animation:fall linear forwards;
}

.confetti:nth-child(3n){background:#f59e0b;}
.confetti:nth-child(4n){background:#3b82f6;}
.confetti:nth-child(5n){background:#ef4444;}
.confetti:nth-child(2n){width:6px;height:10px;}

${[...Array(40)].map((_,i)=>`
.confetti:nth-child(${i+1}){
left:${Math.random()*100}%;
animation-duration:${3+Math.random()*2}s;
animation-delay:${Math.random()*0.6}s;
}
`).join("")}

@keyframes fall{
0%{transform:translateY(0) rotate(0deg);}
100%{transform:translateY(110vh) rotate(720deg);opacity:0;}
}

`}</style>

</div>
</div>
);
}

export default Contact;
