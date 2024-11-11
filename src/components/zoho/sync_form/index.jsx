import { useState, useEffect } from 'react';
import ProgressBar from "../../progress_bar/index"
import axios from "axios";

function ZohoSyncForm({locations, onSyncUpdate}) {
    // const [activeTab, setActiveTab] = useState(0); // Manages active tab index
    const locationOptions = locations.map(i=> i.title);
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
    const tabs = ['Location', 'Grade', 'Condition']; // Tab titles
    const tabContent = [
        'Location',
        'Grade',
        'Condition',
    ]; // Content for each tab
    
    // set initial selectedLocation 
    // useEffect(()=>{
    //     const locationOpt = locations.map(i=> i.title);
    //     locationOpt.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    //     selectedLocation(locationOpt[0]);
    // },[locations]);
    
    const gradeOptions = [
        "AS IS", "IICL", "Cargo Worthy (CW)", "Wind and Water Tight (WWT)"
    ];
    const conditionOptions = [
        "New", "Used", "Refurbished",
    ];
    gradeOptions.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    conditionOptions.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

    // useEffect(()=>{
    //     setSelectedLocation(locationOptions[0]);
    //     setSelectedGrade(gradeOptions[0]);
    //     setSelectedCondition(conditionOptions[0]);
    // },[])

    useEffect(() => {
        if (syncLength > 0 && syncLength > syncIndex && isSyncing) {
            zoho_sync(syncData);
        }
    }, [syncIndex]);

    const handleStartSyncClick = () => {
        setShowReport(false);
        setSyncReport(prev => []);
        setIsSyncing(true);
        setSyncLength(0);
        setSyncProgress(0);
        setSyncData([]);
        const data = { location: selectedLocation, grade: selectedGrade, condition: selectedCondition, }
        // get product ids of products under requested properties
        try {
            axios.post(process.env.REACT_APP_API_URL + "/zoho-bulk-sync-ids", data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(res => {
                console.log(res);
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

    useEffect(()=>{
        onSyncUpdate(syncReport);
    },[syncReport]);

    const zoho_sync = (data) => {
        console.log(`${data.length} > ${syncIndex}`,data.length > syncIndex)
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
                    }else{
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
                    <div className="table-row">
                        <div className="p-3 pl-0 table-cell w-[120px]">
                            Location
                        </div>
                        <div className="p-3 pl-0 table-cell">
                            <select name="location-sync" id="location-sync" className="outline-none border-2 border-stone-500 px-4 rounded w-full" value={selectedLocation} onChange={handleSelectValueOnChange}>
                                {locationOptions.map((option, index) => <option key={`option-${option}`} value={option}>{option}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="table-row">
                        <div className="p-3 pl-0 table-cell">
                            Grade
                        </div>
                        <div className="p-3 pl-0 table-cell">
                            <select name="grade-sync" id="grade-sync" className="outline-none border-2 border-stone-500 px-4 rounded w-full" value={selectedGrade} onChange={handleSelectValueOnChange}>
                                {gradeOptions.map((option, index) => <option key={`option-${option}`} value={option}>{option}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="table-row">
                        <div className="p-3 pl-0 table-cell">
                            Condition
                        </div>
                        <div className="p-3 pl-0 table-cell">
                            <select name="condition-sync" id="condition-sync" className="outline-none border-2 border-stone-500 px-4 rounded w-full" value={selectedCondition} onChange={handleSelectValueOnChange}>
                                {conditionOptions.map((option, index) => <option key={`option-${option}`} value={option}>{option}</option>)}
                            </select>
                        </div>
                    </div>
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
