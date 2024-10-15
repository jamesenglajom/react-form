import UltimateSearch from "../components/ultimate_search"
import useFetchContainers from "../api/useFetchContainers";
import { useState } from "react";
export function Home() {
    const base_url = process.env.REACT_APP_API_URL + '/products';
    const [displayResults, setDisplayResults] = useState(true)
    const { data, loading, error, refetch } = useFetchContainers(base_url);

    const fetchData = () => {
        refetch();
    }

    return (
        <div>
            <UltimateSearch onsearch={fetchData}></UltimateSearch>
            {/* data display container */}
            <div className="w-full p-[20px]  text-[0.8em]">
                {
                    displayResults && <>
                        {
                            data?.products.map((product) => (
                                <div className="w-full flex items-center py-2 px-1 mt-2 rounded-lg border border-stone-300">
                                    <div className="w-[60px] h-[60px]">
                                        {
                                            product?.thumbnail && <img src={product?.thumbnail} alt=""  className="object-contain w-[60px] h-[60px]"/>
                                        }
                                    </div>
                                    <div className="w-[30%] pl-[20px]">
                                        <div>
                                            {product?.name}
                                        </div>
                                        <div>
                                            <span className="font-semibold">SKU: </span>{product?.sku}
                                        </div>
                                    </div>
                                    <div className="w-[100px] text-[1.5em] text-right font-semibold text-stone-500 p-1">
                                        ${product?.price}
                                    </div>
                                    <div className="w-[100px]">
                                        <div className="relative w-full h-full">
                                            <div className="text-[0.8em] text-center">Stocks</div>
                                            <div className={`font-bold text-center ${product?.cf_zoho_link_id ? "text-green-500": "text-red-500"}`}>{product?.stock ? "YES": "NO"}</div>
                                        </div>
                                    </div>
                                    <div className="w-[100px]">
                                        <div className="relative w-full h-full">
                                            <div className="text-[0.8em] text-center">Zoho Sync</div>
                                            <div className={`font-bold text-center ${product?.cf_zoho_link_id ? "text-green-500": "text-red-500"}`}>{product?.cf_zoho_link_id ? "YES": "NO"}</div>
                                        </div>
                                    </div>
                                    <div className="w-[100px]">
                                        <div className="relative w-full h-full">
                                            <div className="text-center">
                                                <button className="rounded text-center bg-red-600 text-white py-1 px-3">Zoho Sync</button>
                                            </div>
                                            <div className="text-center text-[0.8em]">
                                                Last sync date here
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </>
                }
            </div>
        </div>
    )
}