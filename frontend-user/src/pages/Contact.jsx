import { useState } from "react";
import { AiOutlineMail, AiOutlinePhone, AiOutlineMessage, AiOutlineArrowRight } from "react-icons/ai";
import api from "../api/api";
import toast from "react-hot-toast";

function Contact() {

const [formData, setFormData] = useState({
name: "",
email: "",
reason: "Order Inquiry",
message: ""
});

const [loading, setLoading] = useState(false);
const [submitted, setSubmitted] = useState(false);

const handleSubmit = async (e) => {
e.preventDefault();
setLoading(true);

try {
await api.post("/contact", formData);
setSubmitted(true);
setFormData({
name: "",
email: "",
reason: "Order Inquiry",
message: ""
});
toast.success("Message sent successfully!");
}
catch {
toast.error("Failed to send message");
}
finally {
setLoading(false);
}
};

return (
<div className="bg-[#fcfaf8] min-h-screen pt-32 pb-24 px-6 font-sans">

<div className="max-w-6xl mx-auto">

<div className="grid lg:grid-cols-12 gap-16">

{/* LEFT */}
<div className="lg:col-span-5 space-y-10">

<div>
<h2 className="text-5xl font-serif font-black text-stone-900 mb-4">
We’re here to help.
</h2>

<p className="text-stone-400 text-sm leading-relaxed">
Have a question about your order or delivery?  
Our team is available 24/7.
</p>
</div>

{[
{ icon: <AiOutlineMail />, title: "Email Support", value: "vikashwork6@gmail.com" },
{ icon: <AiOutlinePhone />, title: "Direct Hub", value: "+91 6204229636" },
{ icon: <AiOutlineMessage />, title: "Live Chat", value: "Available in App" }
].map((item, i) => (

<div key={i}
className="bg-white p-6 rounded-3xl border border-stone-100 flex items-center gap-5 shadow-sm hover:shadow-xl transition">

<div className="w-14 h-14 bg-stone-50 rounded-2xl flex items-center justify-center text-xl">
{item.icon}
</div>

<div>
<p className="text-xs uppercase tracking-widest text-stone-400 font-bold">
{item.title}
</p>

<p className="text-stone-900 font-bold">
{item.value}
</p>
</div>

</div>

))}

</div>

{/* RIGHT */}
<div className="lg:col-span-7 relative bg-white rounded-[3rem] p-10 shadow-2xl border border-stone-100 overflow-hidden">

{submitted ? (

<div className="absolute inset-0 flex items-center justify-center bg-[#fcfaf8]">

<div className="relative bg-white rounded-[3rem] p-12 w-full max-w-xl shadow-[0_40px_120px_rgba(0,0,0,0.08)] border border-stone-100 text-center animate-success-pop">

<div className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-72 bg-emerald-400/20 blur-[120px] rounded-full"></div>

<div className="relative mx-auto mb-10 w-28 h-28 flex items-center justify-center">

<div className="absolute inset-0 bg-emerald-50 rounded-full animate-ping"></div>

<svg className="relative z-10" width="90" height="90" viewBox="0 0 120 120">
<circle cx="60" cy="60" r="54"
stroke="#10B981"
strokeWidth="4"
fill="none"
className="animate-circle" />

<path d="M38 62L54 78L84 46"
stroke="#10B981"
strokeWidth="6"
strokeLinecap="round"
strokeLinejoin="round"
className="animate-check" />
</svg>

</div>

<h3 className="text-4xl font-serif font-black text-stone-900 mb-3">
Message Sent Successfully
</h3>

<p className="text-stone-400 text-sm mb-10">
Our support team has received your message.  
You will get a reply soon on your email.
</p>

<div className="flex gap-4">

<button
onClick={() => setSubmitted(false)}
className="flex-1 bg-stone-900 text-white py-4 rounded-2xl font-bold hover:bg-stone-800 transition">
Send Another
</button>

<button
onClick={() => window.location.href = "/"}
className="flex-1 bg-stone-100 text-stone-600 py-4 rounded-2xl font-bold hover:bg-stone-200 transition">
Go Home
</button>

</div>

</div>

<style>{`

.animate-success-pop{
animation: pop .5s cubic-bezier(.21,1.02,.73,1) forwards;
}

@keyframes pop{
0%{transform:scale(.8);opacity:0}
100%{transform:scale(1);opacity:1}
}

.animate-circle{
stroke-dasharray: 340;
stroke-dashoffset: 340;
animation: circle .8s ease forwards;
}

@keyframes circle{
to{stroke-dashoffset:0}
}

.animate-check{
stroke-dasharray:120;
stroke-dashoffset:120;
animation: check .5s .8s ease forwards;
}

@keyframes check{
to{stroke-dashoffset:0}
}

`}</style>

</div>

) : (

<>
<h3 className="text-2xl font-serif font-black text-stone-900 mb-6">
Send a Message
</h3>

<form onSubmit={handleSubmit} className="space-y-6">

<div className="grid md:grid-cols-2 gap-6">

<input
required
type="text"
placeholder="Full Name"
value={formData.name}
onChange={(e)=>setFormData({...formData,name:e.target.value})}
className="bg-stone-50 border border-stone-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-stone-200"
/>

<input
required
type="email"
placeholder="Email Address"
value={formData.email}
onChange={(e)=>setFormData({...formData,email:e.target.value})}
className="bg-stone-50 border border-stone-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-stone-200"
/>

</div>

<select
value={formData.reason}
onChange={(e)=>setFormData({...formData,reason:e.target.value})}
className="w-full bg-stone-50 border border-stone-100 p-4 rounded-2xl outline-none">
<option>Order Inquiry</option>
<option>Delivery Feedback</option>
<option>Product Suggestion</option>
<option>Technical Issue</option>
<option>Business Partnership</option>
</select>

<textarea
required
rows="4"
placeholder="Message"
value={formData.message}
onChange={(e)=>setFormData({...formData,message:e.target.value})}
className="w-full bg-stone-50 border border-stone-100 p-4 rounded-2xl outline-none"
/>

<button
disabled={loading}
type="submit"
className="w-full bg-stone-900 text-white p-5 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-stone-800 transition flex items-center justify-center gap-3">

{loading
? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
: <>Send Message <AiOutlineArrowRight /></>
}

</button>

</form>
</>

)}

</div>

</div>

</div>

</div>
);
}

export default Contact;