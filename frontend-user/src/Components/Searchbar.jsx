import React, { useState } from 'react'
import { FiSearch } from "react-icons/fi"

function Searchbar() {
  const [searchItem, setSearchItem] = useState("")

  const handleSearch = () => {
    console.log(searchItem)
  }

  return (
    <div className="flex items-center gap-2 ml-8 w-full max-w-xl">
      
      {/* Search Input */}
      <div className="flex items-center bg-white rounded-xl border px-3 py-2 flex-1 w-150">
        <FiSearch className="text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Search..."
          value={searchItem}
          onChange={(e) => setSearchItem(e.target.value)}
          className="w-full outline-none text-sm"
        />
      </div>

      {/* Search Button */}
      <button onClick={handleSearch} 
      className="bg-blue-500 hover:text-xl text-white px-3 py-2 rounded-md  cursor-pointer w-10 transition-all ease-in-out">
        <FiSearch /></button>

    </div>
  )
}

export default Searchbar
