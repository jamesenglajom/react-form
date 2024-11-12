import { useState, useEffect, forwardRef } from 'react';

export const FormStepLocation = forwardRef(({locations, formData, onChange, className}, ref) => {
    // depot options
    const [depot, setDepot] = useState(formData.depot_id);
    const [selectedDepotDetails, setSelectedDepotDetails] = useState(null);

    useEffect(()=>{
        setDepot(formData.depot_id);
    },[formData])
    
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
        onChange({location: locations.filter(i=> i.id === value)[0].title, depot_id:value})
    }

  return (
    <div className={`w-full ${className}`}>
    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select Location</label>
    <select name="depots" id="depots" value={depot} ref={ref.location} onChange={handleDepotOnChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
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
  );
});

