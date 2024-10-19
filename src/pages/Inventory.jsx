import { useState } from "react";

export function InventoryPage(){
    
    // const [tabs, setTabs] = useState(()=>{
    //     return [
    //         {name:"specs", label: "Specifications"},
    //         {name:"reefer", label: "Reefer"},
    //         {name:"payment", label: "Payment"},
    //         {name:"others", label: "Others"},
    //     ];
    // })
    // const [tab, setTab] = useState("specs");


    return <>
    <h1>Inventory</h1>
    {/* wrapper */}
    {/* <div className="p-5 w-full">
        <div className="">
            <div className="flex items-center justify-between py-1 px-3">
                <div>title</div>
                <div>
                    <button className="rounded-full h-[35px] w-[35px] bg-stone-50 border border-stone-300">x</button>
                </div>
            </div>
            <div className="flex w-full shadow-lg border border-stone-400">
                <div className="w-[150px]">
                    {
                        tabs.map((i,index)=>(
                            <div onClick={()=> setTab(i.name)}key={`tab-${i.name}`} className={`${index < (tabs.length-1)? "border-b":``}  ${tab === i.name?"":"border-r"} border-stone-400`}>
                                <div className={`p-3 ${tab === i.name?"":"text-stone-400"}`}>{i.label}</div>
                            </div>
                        ))
                    }
                </div>
                <div className="p-4">
                    {
                        tab === "specs" && 
                        <div>
                            <div>
                                <label htmlFor=""></label>
                                <select name="" id=""></select>
                            </div>
                        </div>
                    }
                </div>
            </div>
            <div className="mt-5">
                <button className="react-primary-button">Submit</button>
            </div>
        </div>
    </div> */}
    </>
}