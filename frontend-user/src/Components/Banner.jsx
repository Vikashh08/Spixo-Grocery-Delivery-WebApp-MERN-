import React from 'react'
import { useNavigate } from 'react-router-dom'
import Bannertop from '../assets/bannertop.png'
function Banner() {
  const navigate = useNavigate();
  return (
    <div className="w-full pl-20 pr-20 mt-6 mb-6">
      <div className="relative">
        
        <img src={Bannertop} alt="banner" className="w-full h-auto rounded-2xl object-cover"/>

        <button onClick={() => { navigate("/products") }} className="absolute top-3/5 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-purple-800 font-semibold w-auto h-auto 
                     px-6 py-2 rounded-3xl  hover:bg-gray-100 transition cursor-pointer">Shop Now </button>
      </div>
    </div>
  )
}

export default Banner
