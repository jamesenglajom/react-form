import { useState, useEffect } from "react";
import useFetchDepot from "../api/useFetchDepot";
import useFetchCategory from "../api/useFetchCategory";
// components
import { Icon } from "@iconify/react/dist/iconify.js";
import FormRadio from "../components/form_elements/form_radio";
export function InventoryPage() {
    // static
    const form_start_tab = "location";
    const form_last_tab = "category";
    const payment_terms_options = [
        { value: "", label: "Buy" },
        { value: "rental-12", label: "Rental 12months+" },
        { value: "rental-6", label: "Rental 6months+" },
        { value: "rental-3", label: "Rental 3months+" },
        { value: "rto-48", label: "Rent-To-Own 48months" },
        { value: "rto-36", label: "Rent-To-Own 36months" },
        { value: "rto-24", label: "Rent-To-Own 24months" },
        { value: "rto-12", label: "Rent-To-Own 12months" },
    ];

    const size_options = [
        { value: "10'", label: "10-foot" },
        { value: "20'", label: "20-foot" },
        { value: "40'", label: "40-foot" },
        { value: "45'", label: "45-foot" },
        { value: "53'", label: "53-foot" },
    ];

    const height_options = [
        { value: "standard", label: "8' 6\" Standard" },
        { value: "highcube", label: "9' 6\" High Cube (HC)" },
    ];

    const grade_options = [
        { value: "AS IS", label: "AS IS" },
        { value: "Cargo Worthy (CW)", label: "Cargo Worthy (CW)" },
        { value: "IICL", label: "IICL" },
        { value: "Wind and Water tight (WWT)", label: "Wind and Water Tight (WWT)" },
    ];

    const condition_options = [
        { value: "Used", label: "Used" },
        { value: "New", label: "New" },
        { value: "Refurbished", label: "Refurbished" },
    ];

    const selection_type_options = [
        { value: "First off the Stack (FO)", label: "First off the Stack (FO)" },
        { value: "Exclusive Pool (EP)", label: "Exclusive Pool (EP)" },
        { value: "You Pick (UP)", label: "You Pick (UP)" },
    ];

    const door_type_options = [
        { value: "Double Doors at 1 End", label: "Double Doors at 1 End" },
    ];

    // const height
    const { data: locations } = useFetchDepot();
    const { data: categories } = useFetchCategory();
    const [tab, setTab] = useState("category");
    const [tabIndex, setTabIndex] = useState(0);
    const [tabs, setTabs] = useState(() => {
        return [
            { name: "location", label: "Location" },
            { name: "specs", label: "Specifications" },
            { name: "payment_term", label: "Payment Terms" },
            { name: "price", label: "Price" },
            { name: "reefer", label: "Reefer" },
            { name: "category", label: "Category" },
        ];
    });
    // depot options
    const [depot, setDepot] = useState("123");
    const [selectedDepotDetails, setSelectedDepotDetails] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState([15]);
    const [selectedTerm, setSelectedTerm] = useState("");
    // specs state
    const [selectedSize, setSelectedSize] = useState("20'");
    const [selectedHeight, setSelectedHeight] = useState("standard");
    const [selectedGrade, setSelectedGrade] = useState("Wind and Water tight (WWT)");
    const [selectedCondition, setSelectedCondition] = useState("Used");
    const [selectedSelectionType, setSelectedSelectionType] = useState("First off the Stack (FO)");
    const [selectedDoorType, setSelectedDoorType] = useState("Double Doors at 1 End");

    useEffect(() => {
        if (locations && locations.length > 0) {
            setSelectedDepotDetails(locations.filter(i => parseInt(i.id) === parseInt(depot))[0]);
        }
    }, [locations]);


    useEffect(() => {
        setSelectedDepotDetails(locations.filter(i => parseInt(i.id) === parseInt(depot))[0]);
    }, [depot]);

    const handleDepotOnChange = (e) => {
        const { value } = e.target;
        setDepot(value)
    }

    const handleCategoryClick = (category_id) => {
        console.log("handleCategoryClick", category_id);
        setSelectedCategories(prev => {
            console.log("prev", prev)
            console.log("category_id", category_id)
            console.log(prev.includes(parseInt(category_id)))
            if (prev.includes(parseInt(category_id))) {
                return prev.filter(i => parseInt(i) !== parseInt(category_id))
            } else {
                return [...prev, parseInt(category_id)];
            }
        });
    }

    const handleTermClick = (term) => {
        console.log("handleTermClick", term);
        setSelectedTerm(prev => {
            console.log("prev", prev)
            console.log("term", term)
            if (prev === term) {
                return "";
            } else {
                return term;
            }
        });
    }


    const handleFormRadioChange = ({ prop, val }) => {
        console.log("formRadioChanged", `${prop}: ${val}`);
        switch (prop) {
            case "size":
                setSelectedSize(val);
                break;
            case "height":
                setSelectedHeight(val);
                break;
            case "grade":
                setSelectedGrade(val);
                break;
            case "condition":
                setSelectedCondition(val);
                break;
            case "selection_type":
                setSelectedSelectionType(val);
                break;
            case "door_type":
                setSelectedDoorType(val);
                break;
        }
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
                            tabs.map((i, index) => (
                                <div onClick={() => setTab(i.name)} key={`tab-${i.name}`} className={`flex-1 ${index < (tabs.length - 1) ? "border-b" : ``}  ${tab === i.name ? "" : "border-r"} border-stone-400`}>
                                    <div className={`p-3 ${tab === i.name ? "font-bold" : "text-stone-400"}`}>{i.label}</div>
                                </div>
                            ))
                        }
                    </div>
                    <div className="w-full p-4">
                        {
                            tab === "specs" &&
                            <div className="w-full flex flex-col h-full gap-4">
                                <FormRadio label={`Size`} property={"size"} options={size_options} value={selectedSize} defaultValue={"20'"} onSelectionChange={handleFormRadioChange} />
                                <FormRadio label={`Height`} property={"height"} options={height_options} value={selectedHeight} defaultValue={"standard"} onSelectionChange={handleFormRadioChange} />
                                <FormRadio label={`Grade`} property={"grade"} options={grade_options} value={selectedGrade} defaultValue={"Wind and Water tight (WWT)"} onSelectionChange={handleFormRadioChange} />
                                <FormRadio label={`Condition`} property={"condition"} options={condition_options} value={selectedCondition} defaultValue={"Used"} onSelectionChange={handleFormRadioChange} />
                                <FormRadio label={`Selection Type`} property={"selection_type"} options={selection_type_options} value={selectedSelectionType} defaultValue={"First off the Stack (FO)"} onSelectionChange={handleFormRadioChange} />
                                <FormRadio label={`Door Type`} property={"door_type"} options={door_type_options} value={selectedDoorType} defaultValue={"Double Doors at 1 End"} onSelectionChange={handleFormRadioChange} />



                                {/* <div>
                                <div className="mb-1 font-semibold">Size</div>
                                <div className="flex items-center gap-2">
                                    {
                                        size_options.map((v,i)=>
                                            <div key={`size-${i}`} data-value={v.value} className={`cursor-pointer p-2 user-select-none flex items-center border rounded ${selectedSize === v.value ? "border-green-500":"border-stone-300 hover:border-stone-500"}`}
                                             onClick={()=> handleSizeClick(v.value)}>
                                                <div className="pr-2 use-select-none">
                                                    <Icon icon="lets-icons:check-fill" className={`${selectedSize === v.value ? "text-green-500":"text-stone-600"}`}/>
                                                </div>
                                                <div className="user-select-none">{v.label}</div>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                            <div>
                                <div className="mb-1 font-semibold">Height</div>
                                <div className="flex items-center gap-2">
                                    {
                                        height_options.map((v,i)=>
                                            <div key={`height-${i}`} data-value={v.value} className={`cursor-pointer p-2 user-select-none flex items-center border rounded ${selectedHeight === v.value ? "border-green-500":"border-stone-300 hover:border-stone-500"}`}
                                             onClick={()=> handleHeightClick(v.value)}>
                                                <div className="pr-2 use-select-none">
                                                    <Icon icon="lets-icons:check-fill" className={`${selectedHeight === v.value ? "text-green-500":"text-stone-600"}`}/>
                                                </div>
                                                <div className="user-select-none">{v.label}</div>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                            
                            <div>
                                <div className="mb-1 font-semibold">Grade</div>
                                <div className="flex items-center gap-2">
                                    {
                                        grade_options.map((v,i)=>
                                            <div key={`grade-${i}`} data-value={v.value} className={`cursor-pointer p-2 user-select-none flex items-center border rounded ${selectedGrade === v.value ? "border-green-500":"border-stone-300 hover:border-stone-500"}`}
                                             onClick={()=> handleGradeClick(v.value)}>
                                                <div className="pr-2 use-select-none">
                                                    <Icon icon="lets-icons:check-fill" className={`${selectedGrade === v.value ? "text-green-500":"text-stone-600"}`}/>
                                                </div>
                                                <div className="user-select-none">{v.label}</div>
                                            </div>
                                        )
                                    }
                                </div>
                            </div> */}
                            </div>
                        }
                        {
                            tab === "payment_term" &&
                            <div className="w-full flex flex-col h-full gap-1">
                                {
                                    payment_terms_options.map((v, i) =>
                                        <div key={`terms-${i}`} className={`cursor-pointer flex-1 user-select-none flex items-center border rounded ${selectedTerm === v.value ? "bg-green-500 border-green-800" : "bg-white hover:border-stone-400"}`} onClick={() => handleTermClick(v.value)}>
                                            <div className="px-2 use-select-none">
                                                <Icon icon="lets-icons:check-fill" className={`${selectedTerm === v.value ? "text-white" : "text-stone-300"}`} />
                                            </div>
                                            <div className={`${selectedTerm === v.value ? "text-white" : "text-stone-500"}`}>{v.label}</div>
                                        </div>
                                    )
                                }
                            </div>
                        }
                        {
                            tab === "category" &&
                            <div className="w-full flex flex-col h-full gap-1">
                                {
                                    categories && categories.length > 0 && categories.map((v, i) =>
                                        <div key={`cat-${i}`} data-id={v.id} data-slug={v.slug} className={`cursor-pointer flex-1 user-select-none flex items-center border rounded ${selectedCategories.includes(v.id) ? "bg-green-500 border-green-800" : "bg-white hover:border-stone-400"}`} onClick={() => handleCategoryClick(v.id)}>
                                            <div className="px-2 use-select-none">
                                                <Icon icon="lets-icons:check-fill" className={`${selectedCategories.includes(v.id) ? "text-white" : "text-stone-300"}`} />
                                            </div>
                                            <div className={`${selectedCategories.includes(v.id) ? "text-white" : "text-stone-500"}`}>{v.name}</div>
                                        </div>
                                    )
                                }
                            </div>
                        }
                        {
                            tab === "location" &&
                            <div className="w-full">
                                <select name="depots" id="depots" value={depot} onChange={handleDepotOnChange} className="w-full border border-stone-400 py-2 px-3">
                                    {
                                        locations && locations.length > 0 && locations.map((v, i) =>
                                            <option key={`depot-${v.id}`} value={v.id}>
                                                {`${v.title} ${v.country == 223 ? "(US)" : "(CA)"}`}
                                            </option>
                                        )
                                    }
                                </select>
                                {
                                    selectedDepotDetails && <div className="w-full flex flex-col gap-4 mt-4">
                                        <div>DepotID: {selectedDepotDetails.id}</div>
                                        <div>Country: {selectedDepotDetails.country == 223 ? "United States" : "Canada"}</div>
                                        <div>Relocation Fee: ${JSON.parse(selectedDepotDetails.custom)?.relocation_fee ? JSON.parse(selectedDepotDetails.custom)?.relocation_fee : 0}</div>
                                    </div>
                                }
                            </div>
                        }
                    </div>
                </div>
                <div className="mt-5">
                    <div className="w-full flex justify-between items-center">
                        <div>
                            <button className={`react-secondary-button mr-4 ${tab !== form_start_tab ? "":"disabled"}`}>Previous</button>
                            <button className={`react-secondary-button ${tab !== form_last_tab ? "":"disabled"}`}>Next</button>
                        </div>
                        <div>
                            <button className={`react-primary-button ${tab === form_last_tab ? "":"disabled"}`}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}