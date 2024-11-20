import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import useFetchDepot from '../api/useFetchDepot';
import FormRadio from '../components/form_elements/form_radio';
export const TabComponent = () => {
    const { data: locations } = useFetchDepot();
    const tabs = [
        { name: "location", label: "Location" },
        { name: "specs", label: "Specifications" },
        { name: "pricing_terms", label: "Pricing & Terms" },
        { name: "other", label: "Other" },
        // { name: "category", label: "Category" },
    ];
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

    const sales_tag_options = [
        { value: "", label: "None" },
        { value: "best seller", label: "Best Seller" },
        { value: "top choice", label: "Top Choice" },
    ];

    const reefer_options = [
        { value: "1", label: "Yes" },
        { value: "0", label: "No" },
    ];

    const reefer_status_options = [
        { value: "1", label: "Yes" },
        { value: "0", label: "No" },
    ];
    const form_start_tab = "location";
    const form_last_tab = "other";

    const [tab, setTab] = useState("location");
    const [selectedDepotDetails, setSelectedDepotDetails] = useState(null);

    // Primary and secondary tab states
    const [activePrimaryTab, setActivePrimaryTab] = useState('Shipping Container');
    const [activeSecondaryTab, setActiveSecondaryTab] = useState('Location');
    const [selectedCategories, setSelectedCategories] = useState([15]);
    const [selectedTerm, setSelectedTerm] = useState("");
    const [price, setPrice] = useState(0);
    // specs state
    const [selectedSize, setSelectedSize] = useState("20'");
    const [selectedHeight, setSelectedHeight] = useState("standard");
    const [selectedGrade, setSelectedGrade] = useState("Wind and Water tight (WWT)");
    const [selectedCondition, setSelectedCondition] = useState("Used");
    const [selectedSelectionType, setSelectedSelectionType] = useState("First off the Stack (FO)");
    const [selectedDoorType, setSelectedDoorType] = useState("Double Doors at 1 End");
    // other
    const [containerGradeTitle, setContainerGradeTitle] = useState("");
    const [containerType, setContainerType] = useState("");
    const [selectedSalesTag, setSelectedSalesTag] = useState("");
    const [selectedReefer, setSelectedReefer] = useState("1");
    const [selectedReeferStatus, setSelectedReeferStatus] = useState("1");

    // Primary and secondary tab arrays
    const primaryTabs = ['Shipping Container', 'Accessory', 'Modification'];
    const secondaryTabs = ['Location', 'Pricing and Terms', 'Specifications', 'Others'];

    // Form data state
    const [formData, setFormData] = useState({
        location: 'Abilene, TX',
        depot_id: '123',
        price: '',
        terms: '',
        length: '',
        width: '',
        otherDetails: ''
    });


    useEffect(() => {
        if (locations && locations.length > 0) {
            const details = locations.filter(i => parseInt(i.id) === parseInt(formData.depot_id))[0];
            if(isValidJSON(details["custom"])){
                details["custom"] = JSON.parse(details["custom"]);
            }else{
                details["custom"] = details["custom"];
            }
            setSelectedDepotDetails(details);
        }
    }, [locations]);

    const isValidJSON = (json_var) => {
        try{
            JSON.parse(json_var);
            return true;
        }catch(e){
            return false;
        }
    }

    // Handle primary tab click
    const handlePrimaryTabClick = (tab) => {
        setActivePrimaryTab(tab);
        setActiveSecondaryTab('Location'); // Reset secondary tab when switching primary tabs
    };

    // Handle secondary tab click
    const handleSecondaryTabClick = (tab) => {
        setActiveSecondaryTab(tab);
    };

    // Handle form input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFormNavController = (direction) => {
        // direction prev or next
        setTab(prev => {
            const index = tabs.findIndex(i => i.name === prev);
            if (direction === "prev") {
                return tabs[index - 1].name;
            } else {
                return tabs[index + 1].name;
            }
        })
    }

    const handleDepotOnChange = (e) => {
        const { value } = e.target;
        const location_title = locations.filter(i => i.id === value)[0].title;
        const details = locations.filter(i => parseInt(i.id) === parseInt(value))[0];
        if(isValidJSON(details["custom"])){
            details["custom"] = JSON.parse(details["custom"]);
        }else{
            details["custom"] = details["custom"];
        }
        setSelectedDepotDetails(details);
        setFormData(prev => ({ ...prev, depot_id: value, location: location_title }));
        // setDepot(value)
    }

    const handleFormRadioChange = ({ prop, val }) => {
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
            case "sales_tag":
                setSelectedSalesTag(val);
                break;
            case "reefer":
                setSelectedReefer(val);
                break;
            case "reefer_status":
                setSelectedReeferStatus(val);
                break;
        }
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

    const handlePriceInput = (e) => {
        const { value } = e.target;
        // Allow only numeric input and empty string
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setPrice(value); // Update the state
        }
    }

    const handleContainerGradeTitle = (e) => {
        const {value} = e.target;
        setContainerGradeTitle(value);
    }

    const handleContainerType = (e) => {
        const {value} = e.target;
        setContainerType(value);
    }
    return (
        <div className="z-[9999] bg-indigo-300 fixed top-0 bottom-0 left-0 right-0 w-full h-svh flex justify-center items-center">
            <div className="shadow-lg w-[800px] bg-white rounded-lg overflow-hidden">
                <div className="">
                    <div className="w-full flex justify-between item-center">
                        {/* Primary Tab Buttons */}
                        <div className="w-[calc(100%-100px)] flex border-b">
                            {primaryTabs.map((tab) => (
                                <button
                                    key={tab}
                                    className={`py-2 px-4 font-semibold focus:outline-none ${activePrimaryTab === tab ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'
                                        }`}
                                    onClick={() => handlePrimaryTabClick(tab)}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <div className="w-[100px] flex item-center justify-end pt-[10px] pr-[10px] border-b">
                            <Icon icon="mingcute:close-fill" />
                        </div>
                    </div>
                    {/* modal content */}
                    {
                        activePrimaryTab === "Shipping Container" && (<>
                            {/* primary tab heading */}
                            <div className="flex justify-between p-4 border-b">
                                <div className="pr-[50px]">
                                    <div className="font-semibold">
                                        Rent-To-Own Used 20 ft Standard Shipping Container - Wind & Water Tight (48 Months) - Abilene, TX
                                    </div>
                                    <div>SKU: U20SDV1DDWWTFOALTXRTO48</div>
                                </div>
                            </div>
                            <div className="flex w-full p-0 min-h-[400px]">
                                <div className="w-[180px] cursor-pointer flex flex-col bg-stone-200">
                                    {
                                        tabs.map((i, index) => (
                                            <div onClick={() => setTab(i.name)} key={`tab-${i.name}`} className={`flex-1 flex items-center px-4 py-[15px] border-white ${index < (tabs.length - 1) ? "border-b" : ``}  ${tab === i.name ? "bg-white" : "border-r"}`}>
                                                <div className={`${tab === i.name ? "font-bold" : "text-stone-400"}`}>{i.label}</div>
                                            </div>
                                        ))
                                    }
                                </div>
                                <div className="w-full p-4">
                                    <div>
                                        <div>
                                            {activePrimaryTab === 'Shipping Container' && (
                                                <div>

                                                    {/* Secondary Tab Content with Form Elements */}
                                                    <div className="mt-4">
                                                        {
                                                            tab === "location" &&
                                                            <div className="w-full">
                                                                <label className="block mb-2">Select Location</label>
                                                                <select name="depots" id="depots" value={formData.depot_id} onChange={handleDepotOnChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
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
                                                                        <div>Relocation Fee: ${selectedDepotDetails?.custom?.relocation_fee}</div>
                                                                        <div>Is Virtual Depot: {selectedDepotDetails?.custom?.is_virtual_depo}</div>
                                                                    </div>
                                                                }
                                                            </div>
                                                        }
                                                        {
                                                            tab === "specs" &&
                                                            <div className="w-full flex flex-col gap-2">
                                                                <FormRadio label={`Size`} property={"size"} options={size_options} value={selectedSize} defaultValue={"20'"} onSelectionChange={handleFormRadioChange} />
                                                                <FormRadio label={`Height`} property={"height"} options={height_options} value={selectedHeight} defaultValue={"standard"} onSelectionChange={handleFormRadioChange} />
                                                                <FormRadio label={`Grade`} property={"grade"} options={grade_options} value={selectedGrade} defaultValue={"Wind and Water tight (WWT)"} onSelectionChange={handleFormRadioChange} />
                                                                <FormRadio label={`Condition`} property={"condition"} options={condition_options} value={selectedCondition} defaultValue={"Used"} onSelectionChange={handleFormRadioChange} />
                                                                <FormRadio label={`Selection Type`} property={"selection_type"} options={selection_type_options} value={selectedSelectionType} defaultValue={"First off the Stack (FO)"} onSelectionChange={handleFormRadioChange} />
                                                                <FormRadio label={`Door Type`} property={"door_type"} options={door_type_options} value={selectedDoorType} defaultValue={"Double Doors at 1 End"} onSelectionChange={handleFormRadioChange} />
                                                            </div>
                                                        }
                                                        {
                                                            tab === "pricing_terms" &&
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
                                                                {
                                                                    <div className="pt-2">
                                                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
                                                                        <input type="number" value={price} onChange={handlePriceInput} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                                                                    </div>
                                                                }
                                                            </div>
                                                        }
                                                        {
                                                            tab === "other" &&
                                                            <div className="w-full flex flex-col gap-4">
                                                                <div className="">
                                                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Container Grade Title</label>
                                                                    <input value={containerGradeTitle} onChange={handleContainerGradeTitle} type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                                                                </div>
                                                                <div className="">
                                                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Container Type</label>
                                                                    <input value={containerType} onChange={handleContainerType} type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                                                                </div>
                                                                <FormRadio label={`Sales Tag`} property={"sales_tag"} options={sales_tag_options} value={selectedSalesTag} defaultValue={""} onSelectionChange={handleFormRadioChange} />
                                                                <FormRadio label={`Reefer Container`} property={"reefer"} options={reefer_options} value={selectedReefer} defaultValue={"1"} onSelectionChange={handleFormRadioChange} />
                                                                <FormRadio label={`Reefer Container Status`} property={"reefer_status"} options={reefer_status_options} value={selectedReeferStatus} defaultValue={"1"} onSelectionChange={handleFormRadioChange} />
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            )}

                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="p-4 border-t">
                                <div className="w-full flex justify-between items-center">
                                    <div>
                                        <button onClick={() => handleFormNavController("prev")} className={`react-secondary-button mr-4 ${tab !== form_start_tab ? "" : "disabled"}`}>Previous</button>
                                        <button onClick={() => handleFormNavController("next")} className={`react-secondary-button ${tab !== form_last_tab ? "" : "disabled"}`}>Next</button>
                                    </div>
                                    <div>
                                        <button className={`react-primary-button ${tab === form_last_tab ? "" : "disabled"}`}>Submit</button>
                                    </div>
                                </div>
                            </div></>)
                    }
                    {activePrimaryTab === 'Accessory' && (
                        <div className="p-4">
                            <h2 className="text-xl font-bold mb-2">Accessory Content</h2>
                            <p>This section contains information about accessories.</p>
                        </div>
                    )}
                    {activePrimaryTab === 'Modification' && (
                        <div className="p-4">
                            <h2 className="text-xl font-bold mb-2">Modification Content</h2>
                            <p>This section contains information about modifications.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

//