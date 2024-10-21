import { useState, useEffect } from "react";
import useFetchDepot from "../api/useFetchDepot";
import useFetchCategory from "../api/useFetchCategory";
import { Icon } from "@iconify/react/dist/iconify.js";
export function InventoryPage(){
    const {data:locations} = useFetchDepot();
    const {data:categories} = useFetchCategory();
    const [tab, setTab] = useState("category");
    const [tabs, setTabs] = useState(()=>{
        return [
            {name:"category", label: "Category"},
            {name:"specs", label: "Specifications"},
            {name:"location", label: "Location"},
            {name:"payment", label: "Payment & Pricing"},
            {name:"reefer", label: "Reefer"},
            {name:"others", label: "Others"},
        ];
    })
    const [depot, setDepot] = useState("123");
    const [selectedDepotDetails, setSelectedDepotDetails] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState([]);

    useEffect(()=>{
        if(locations && locations.length > 0){
            setSelectedDepotDetails(locations.filter(i=> parseInt(i.id) === parseInt(depot))[0]);
        }
    },[locations]);

    
    useEffect(()=>{
        setSelectedDepotDetails(locations.filter(i=> parseInt(i.id) === parseInt(depot))[0]);
    },[depot]);

    const handleDepotOnChange = (e) => {
        const {value} = e.target;
        setDepot(value)
    }

    const handleCategoryClick = (category_id) => {
        console.log("handleCategoryClick", category_id);
        setSelectedCategories(prev => {
            console.log("prev",prev)
            console.log("category_id",category_id)
            console.log(prev.includes(parseInt(category_id)))
            if(prev.includes(parseInt(category_id))){
                return prev.filter(i=> parseInt(i) !== parseInt(category_id))
            }else{
                return [...prev, parseInt(category_id)];
            }
        });
    }

    return <>
    <h1>Inventory</h1>
    {/* wrapper */}
    <div className="p-5 w-full">
        <div className="">
            <div className="flex items-center justify-between py-1 px-3">
                <div>title</div>
                <div>
                    <button className="rounded-full h-[35px] w-[35px] bg-stone-50 border border-stone-300">x</button>
                </div>
            </div>
            <div className="flex w-full shadow-lg border border-stone-400">
                <div className="w-[150px] cursor-pointer flex flex-col">
                    {
                        tabs.map((i,index)=>(
                            <div onClick={()=> setTab(i.name)}key={`tab-${i.name}`} className={`flex-1 ${index < (tabs.length-1)? "border-b":``}  ${tab === i.name?"":"border-r"} border-stone-400`}>
                                <div className={`p-3 ${tab === i.name?"font-bold":"text-stone-400"}`}>{i.label}</div>
                            </div>
                        ))
                    }
                </div>
                <div className="w-full p-4">
                    {
                        tab === "category" && 
                        <div className="w-full flex flex-col h-full gap-1">
                            {
                                categories && categories.length > 0 && categories.map((v,i)=> 
                                <div key={`cat-${i}`} data-id={v.id} data-slug={v.slug} className={`cursor-pointer flex-1 user-select-none flex items-center border rounded ${selectedCategories.includes(v.id) ? "border-green-500":"border-stone-300 hover:border-stone-500"}`} onClick={()=>handleCategoryClick(v.id)}>
                                    <div className="px-2 use-select-none">
                                        <Icon icon="lets-icons:check-fill" className={`${selectedCategories.includes(v.id) ? "text-green-500":"text-stone-600"}`}/>
                                    </div>
                                    <div className="user-select-none">{v.name}</div>
                                </div>
                                )
                            }
                        </div>
                    }
                    {
                        tab === "location" && 
                        <div className="w-full">
                            <select name="depots" id="depots" value={depot} onChange={handleDepotOnChange}>
                            {
                                locations && locations.length > 0 && locations.map((v, i)=> 
                                    <option key={`depot-${v.id}`} value={v.id}>
                                        {`${v.title} ${v.country ==  223 ? "(US)":"(CA)"}`}
                                    </option>
                                )
                            }
                            </select>
                            {
                                selectedDepotDetails && <div className="w-full">
                                    <div>DepotID: {selectedDepotDetails.id}</div>
                                    <div>Country: {selectedDepotDetails.country == 223? "United States": "Canada"}</div>
                                    <div>Relocation Fee: ${JSON.parse(selectedDepotDetails.custom)?.relocation_fee ?JSON.parse(selectedDepotDetails.custom)?.relocation_fee:0 }</div>
                                </div>
                            }
                        </div>
                    }
                </div>
            </div>
            <div className="mt-5">
                <button className="react-primary-button">Submit</button>
            </div>
        </div>
    </div>
    </>
}