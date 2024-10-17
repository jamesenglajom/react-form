import { useState, useEffect } from 'react';
import axios from "axios";

function UltimateSearch({ onSearch }) {
    const [search, setSearch ] = useState("");
    
    const handleInput = (e) => {
        const {value} = e.target;
        setSearch(value);
        onSearch(value);
    }

    return (
        <div className="w-full p-1 flex">
            <input type="search" className="w-full py-1 px-3" placeholder="Search for Containers..." value={search} onInput={handleInput}/>
            {/* <button className="py-1 px-3 text-white bg-stone-700">Search</button> */}
        </div>
    )
}

export default UltimateSearch;
