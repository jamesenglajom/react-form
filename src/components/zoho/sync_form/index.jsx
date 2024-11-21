import { useState, useEffect } from 'react';
import ProgressBar from "../../progress_bar/index"
import axios from "axios";

function ZohoSyncForm({ locations, onSyncUpdate }) {
    // const [activeTab, setActiveTab] = useState(0); // Manages active tab index
    
    const locationOptions = locations.map(i => i.title);
    locationOptions.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncLength, setSyncLength] = useState(0);
    const [syncIndex, setSyncIndex] = useState(0);
    const [syncProgress, setSyncProgress] = useState(0);
    const [syncData, setSyncData] = useState([]);
    const [syncReport, setSyncReport] = useState([]);
    const [showReport, setShowReport] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(locationOptions[0]);
    const [selectedGrade, setSelectedGrade] = useState("AS IS");
    const [selectedCondition, setSelectedCondition] = useState("New");
    const [productType, setProductType] = useState("containers");

    const gradeOptions = [
        "AS IS", "IICL", "Cargo Worthy (CW)", "Wind and Water Tight (WWT)"
    ];
    const conditionOptions = [
        "New", "Used", "Refurbished",
    ];


    gradeOptions.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    conditionOptions.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    
    const formDataDefault = {
        product_type: "containers",
        location: locationOptions[0],
        grade: gradeOptions[0],
        condition: conditionOptions[0],
        acc_type: "lighting",//acc_category
    };

    const [formData, setFormData] = useState(formDataDefault);

    const filters = [
        {
            for: "general", label: "Product Type", name: "product_type", options: [
                { id: "containers", label: "Shipping Containers" },
                { id: "accessories", label: "Accessories" },
            ]
        },
        { for: "containers", label: "Location", name: "location", options: locationOptions.map(i => ({ id: i, label: i })) },
        { for: "containers", label: "Grade", name: "grade", options: gradeOptions.map(i => ({ id: i, label: i })) },
        { for: "containers", label: "Condition", name: "condition", options: conditionOptions.map(i => ({ id: i, label: i })) },
        // accessory type (accessories)
        {
            for: "accessories", label: "Type", name: "acc_type", options: [
                { id: "lighting", label: "Lighting" },
                { id: "ramp", label: "Ramp" },
                { id: "security", label: "Security" },
                { id: "shelving", label: "Shelving" },
            ]
        },

    ];


    useEffect(() => {
        if (syncLength > 0 && syncLength > syncIndex && isSyncing) {
            zoho_sync(syncData);
        }
    }, [syncIndex]);
    
    const formatFormData = (data) => {
        const tmp = data;
        const tmp_keys = Object.keys(tmp);
        const inclusion_keys = filters.filter(i=> (i.for===productType || i.for==="general")).map(i=> i.name); 
        const filteredKeys = tmp_keys.filter(i=> inclusion_keys.includes(i)) 
        const formattedData = filteredKeys.reduce((acc, key) => {
            if (key in tmp) {
              acc[key] = tmp[key];
            }
            return acc;
          }, {}); 
        return formattedData;
    }

    const handleStartSyncClick = () => {
        setShowReport(false);
        setSyncReport(prev => []);
        setIsSyncing(true);
        setSyncLength(0);
        setSyncProgress(0);
        setSyncData([]);
        const data = formatFormData(formData);
        try {
            axios.post(process.env.REACT_APP_API_URL + "/zoho-bulk-sync-ids", data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(res => {
                const { data } = res;
                let dataChunks = [];
                if (data.count === 0) {
                    alert("There are no data to sync.")
                    setIsSyncing(false);
                } else if (data.count > 10) {
                    dataChunks = splitArrayIntoChunks(data.data, 10)
                } else {
                    dataChunks.push(data.data);
                }

                if (dataChunks.length > 0) {
                    sync_products_to_zoho(dataChunks);
                }
            });
        } catch (error) {
            console.log("zoho bulk sync error response: ", error);
        }
    }

    const sync_products_to_zoho = (data) => {
        setSyncLength(data.length);
        setSyncData(data);
        zoho_sync(data);
    }

    useEffect(() => {
        onSyncUpdate(syncReport);
    }, [syncReport]);

    const zoho_sync = (data) => {
        console.log(`${data.length} > ${syncIndex}`, data.length > syncIndex)
        if (data.length > syncIndex) {
            const product_ids = { product_ids: data[syncIndex], progress_index: syncIndex, progress_length: data.length };
            try {
                axios.post(process.env.REACT_APP_API_URL + "/zoho-bulk-sync", product_ids, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }).then(res => {
                    const { progress, report } = res.data;
                    setSyncProgress(prev => progress);
                    setSyncReport(prev => [...prev, ...report]);

                    if (progress === 100) {
                        setShowReport(true);
                        setIsSyncing(false);
                        setSyncIndex(prev => 0);
                    } else {
                        setSyncIndex(prev => prev + 1);
                    }
                })
            } catch (error) {
                setIsSyncing(false);
                console.log("bulk sync error response: ", error)
            }
        }
    }

    const handleSelectValueOnChange = (e) => {
        const { name, value } = e.target;
        // console.log(name, value);
        if (name === "location-sync") {
            setSelectedLocation(value);
        } else if (name === "grade-sync") {
            setSelectedGrade(value);
        } else if (name === "condition-sync") {
            setSelectedCondition(value);
        }
    }

    const handleFilterSelect = (e) => {
        const {name, value} = e.target;
        setFormData(prev=> ({...prev, [name]:value}))
        if(name==="product_type"){
            setProductType(value);
        }
    }

    const splitArrayIntoChunks = (arr, chunkSize) => {
        const result = [];
        for (let i = 0; i < arr.length; i += chunkSize) {
            result.push(arr.slice(i, i + chunkSize));
        }
        return result;
    };

    return (
        <div className="w-full p-5">
            <h1>Zoho Sync</h1>
            <div className="p-4 bg-white border border-gray-200 rounded-lg">
                <p>Select properties of products to sync.</p>
                <div className="table">
                    {
                        filters.map((i,index) => 
                            (i?.["for"] === "general" || i?.["for"] === productType) && (
                                <div className="table-row" key={`${i.name}-${index}`}>
                                    <div className="p-3 pl-0 table-cell w-[120px]">
                                        { i.label }
                                    </div>
                                    <div className="p-3 pl-0 table-cell">
                                        <select name={i.name} id={i.name} className="outline-none border-2 border-stone-500 px-4 rounded w-full" value={formData[i.name]} onChange={handleFilterSelect} disabled={isSyncing}>
                                            {i.options.map((option, index) => <option key={`option-${i.name}-${option.id}`} value={option.id}>{option.label}</option>)}
                                        </select>
                                    </div>
                                </div>
                            )
                        )
                    }
                </div>
                <div className="w-full">
                    <ProgressBar progress={syncProgress} />
                </div>
                {
                    showReport &&
                    <div className="w-full">
                        Report
                        <div className="w-full">
                            <div className="table text-sm border w-full">
                                {
                                    syncReport.map((v, i) => <div key={`report-${v.response_data.code}-${v.wc_product_id}`} className="table-row">
                                        <div className="table-cell py-3 px-2">
                                            <span className={v.response_data.code === 0 ? 'text-green-500' : 'text-red-500'}>{v.response_data.message} <span className="text-stone-500">{v.wc_product_id}</span></span>
                                        </div>
                                    </div>)
                                }
                            </div>
                        </div>
                    </div>
                }
            </div>
            <div className="p-3 w-full flex justify-between">
                <button className={`react-primary-button ${isSyncing ? "disabled" : ""}`} onClick={handleStartSyncClick} disabled={isSyncing}>{isSyncing ? "Syncing..." : "Start Sync"}</button>
            </div>
        </div>
    );
}

export default ZohoSyncForm;
