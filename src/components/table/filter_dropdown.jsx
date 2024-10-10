// TableFilterButton.jsx
import React from "react";
import PropTypes from "prop-types";
import { useEffect, useState, useRef } from 'react';
// prop type not yet implemented
// options: array, type: string
const TableFilterButton = ({ options, type, onChange, title, name, value }) => {
    // const [value, setSelection] = useState([]);
    const [selectionText, setSelectionText] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    // open dropdown
    const handleOpenDropdown = () => {
        setIsOpen(true);
    }
    // close on outside click
    const handleClickOutside = (event) => {
        // Check if the click was outside of the dropdown element
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };
    useEffect(() => {
        // Add event listener for clicks outside of the dropdown
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup event listener on component unmount
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    // value handler
    const handleSelection = (v) => {
        if (v.target.checked) {
            let newArr = [...value, v.target.name]
            onChange({name:name, value:[...new Set(newArr)]})
        } else {
            onChange({name:name, value:value.filter(i => i !== v.target.name)})
        }
    }
    // handle text on seletion
    useEffect(() => {
            let temp = options.filter(i=> value.includes(i.id))
            setSelectionText(value.length == 0 ? '':` is ${temp.map(item => item.label).toString()}`);

        }, [value, options]);
    
    const clearSelection = () => {
        onChange({name:name, value:[]})
    }

    return (
        <div className="relative">
            <div>
                <button onClick={handleOpenDropdown} className={`table-filter-tab-button ${value.length > 0 ? 'active': ''}`}>{ title }<span className=" ml-1">{selectionText}</span></button>
            </div>
            {/* dropdown */}
            {isOpen && options.length > 0 && (<div ref={dropdownRef} className="generic-dropdown absolute top-[100%] bg-white border border-stone-300 left-0 rounded-md mt-[5px] z-[10]">
                <div className="overflow-hidden w-full p-4 grid gap-[5px]">
                    {/* <div className="text-sm mb-2">Sort by</div> */}
                    {options.map(option => (
                        <div key={`table-filters-${name}-${option.id}`} className="flex gap-[10px] flex-0-0-auto whitespace-nowrap">
                            <input type="checkbox" className="inline-block cursor-pointer" id={`table-filter-${name}-${option.id}`} name={option.id} onChange={handleSelection} value={options.id} checked={value.includes(option.id)}/>
                            <label htmlFor={`table-filter-${name}-${option.id}`} className="text-sm inline-block overflow-ellipsis whitespace-nowrap text-stone-700 select-none cursor-pointer">
                                {option.label}
                            </label>
                        </div>
                    ))}
                    <div>
                        <button disabled={value.length > 0 ? false:true} className={`table-filter-tab-clear-button ${value.length > 0 ? 'active':''}`} onClick={clearSelection}>Clear</button>
                    </div>
                </div>
            </div>)
            }
        </div>

    );
};

TableFilterButton.propTypes = {
    title: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.array.isRequired,
};


export default TableFilterButton;
