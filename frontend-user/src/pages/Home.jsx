import { useNavigate } from "react-router-dom";
import Banner from "../Components/Banner";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#fdfcfb] min-h-screen">
      <Banner /> {/* Ensure your Banner.jsx uses the rounded-2xl style */}
      
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-800 mb-4 tracking-tight">
            Trusted by families, chosen every day
          </h2>
          <p className="text-stone-500 text-lg font-medium max-w-2xl mx-auto italic">
            "Because your family deserves the best."
          </p>
        </div>

        {/* Featured Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { name: "Organic Vegetables", img: "🥦", color: "bg-emerald-50" },
            { name: "Daily Dairy", img: "🥛", color: "bg-stone-100" },
            { name: "Artisan Bread", img: "🍞", color: "bg-orange-50" }
          ].map((cat) => (
            <div 
              key={cat.name}
              onClick={() => navigate("/products")}
              className={`${cat.color} rounded-[3rem] p-10 flex flex-col items-center justify-center cursor-pointer hover:shadow-2xl hover:shadow-stone-200 transition-all duration-500 group`}
            >
              <span className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-500">{cat.img}</span>
              <h3 className="text-xl font-serif font-bold text-stone-800">{cat.name}</h3>
              <p className="text-emerald-700 font-bold text-xs uppercase tracking-widest mt-2">Explore Selection</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;