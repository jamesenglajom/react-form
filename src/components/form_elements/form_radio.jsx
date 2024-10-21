import React, {useState, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

const FormRadio = ({ label, property, options, value, defaultValue, onSelectionChange }) => {
    const [radioOptions, setRadioOptions] = useState(options);
    useState(()=>{if(options) setRadioOptions(options)},[options]);
    const [radioValue, setRadioValue] = useState(value);
    useState(()=>{if(value) setRadioValue(value)},[value]);

    const handleRadioClick = (v) => {
        setRadioValue(prev => {
            if(prev === v){
                return defaultValue;
            }else{
                return v;
            }
        });
    }

    useEffect(()=>{
        if(radioValue){
            onSelectionChange({prop: property, val: radioValue})
        }
    },[radioValue]);
    return (
        <div>
            <div className="mb-1 font-semibold">{label}</div>
            <div className="flex items-center gap-2">
                {
                    radioOptions && radioOptions.map((v, i) =>
                        <div key={`size-${i}`} data-value={v.value} className={`cursor-pointer p-2 user-select-none flex items-center border rounded ${radioValue === v.value ? "bg-green-500 border-green-800" : "bg-white hover:border-stone-400"}`}
                            onClick={() => handleRadioClick(v.value)}>
                            <div className="pr-2 use-select-none">
                                <Icon icon="lets-icons:check-fill" className={`${radioValue === v.value ? "text-white" : "text-stone-300"}`} />
                            </div>
                            <div className={`${radioValue === v.value ? "text-white" : "text-stone-500"}`}>{v.label}</div>
                        </div>
                    )
                }
            </div>
        </div>
    );
};


export default FormRadio;
