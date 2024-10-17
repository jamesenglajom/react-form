// TableFilterButton.jsx
import React from "react";
import PropTypes from "prop-types";
import { useEffect, useState, useRef, useMemo } from 'react';
// prop type not yet implemented
// options: array, type: string
const TableFilterButton = ({ options, type, onChange, title, name, value }) => {
    // const [value, setSelection] = useState([]);
    const [selectionText, setSelectionText] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selections, setSelections] = useState([]);
    const [filterValue, setFilterValue] = useState(value);
    const dropdownRef = useRef(null);
    const options_memo = useMemo(() => options);
    useEffect(()=>{
        setSelections(options_memo);
    }, [options]);
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
            let newArr = [...filterValue, v.target.name];
            setFilterValue([...new Set(newArr)]);
            onChange({name:name, value:[...new Set(newArr)]})
        } else {
            let newArr = filterValue.filter(i => i !== v.target.name);
            setFilterValue([...new Set(newArr)]);
            onChange({name:name, value:[...new Set(newArr)]})
        }
    }
    // handle text on seletion
    useEffect(() => {
            let temp = selections.filter(i=> filterValue.includes(i.id))
            setSelectionText(filterValue.length == 0 ? '':` is ${temp.map(item => item.label).toString()}`);

        }, [filterValue, selections]);
    
    const clearSelection = () => {
        setFilterValue([]);
        onChange({name:name, value:[]})
    }

    return (
        <div className="relative">
            <div>
                <button onClick={handleOpenDropdown} className={`table-filter-tab-button ${filterValue.length > 0 ? 'active': ''}`}>{ title }<span className=" ml-1">{selectionText}</span></button>
            </div>
            {/* dropdown */}
            {isOpen && selections.length > 0 && (<div ref={dropdownRef} className="generic-dropdown absolute top-[100%] bg-white border border-stone-300 left-0 rounded-md mt-[5px] z-[10]">
                <div className="w-full p-4 grid gap-[5px] max-h-[350px] overflow-y-auto">
                    {/* <div className="text-sm mb-2">Sort by</div> */}
                    {selections.map(option => (
                        <div key={`table-filters-${name}-${option.id}`} className="flex gap-[10px] flex-0-0-auto whitespace-nowrap">
                            <input type="checkbox" className="inline-block cursor-pointer" id={`table-filter-${name}-${option.id}`} name={option.id} onChange={handleSelection} value={selections.id} checked={filterValue.includes(option.id)}/>
                            <label htmlFor={`table-filter-${name}-${option.id}`} className="text-sm inline-block overflow-ellipsis whitespace-nowrap text-stone-700 select-none cursor-pointer">
                                {option.label}
                            </label>
                        </div>
                    ))}
                </div>
                <div className="px-4 pb-2 pt-0">
                    <button disabled={filterValue.length > 0 ? false:true} className={`table-filter-tab-clear-button ${filterValue.length > 0 ? 'active':''}`} onClick={clearSelection}>Clear</button>
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
