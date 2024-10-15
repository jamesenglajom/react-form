import { useState, useEffect } from 'react';
import axios from "axios";

function UltimateSearch({onSearch}) {
    return (
        <div>
            <div className="w-full bg-red-500 flex justify-center items-center p-2">
                <div className="w-[90%] bg-green-500">
                    <input type="search" className="w-full py-1 px-3" placeholder="Search for Containers..." />
                </div>
            </div>
        </div>
    )
}

export default UltimateSearch;
