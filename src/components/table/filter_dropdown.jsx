// TableFilterButton.jsx
import React from "react";
import PropTypes from "prop-types";
import { useEffect, useState, useRef } from 'react';
// prop type not yet implemented
// options: array, type: string
const TableFilterButton = ({ options, type, onChange, title,name }) => {
    const [selection, setSelection] = useState([]);
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
    // selection handler
    const handleSelection = (v) => {
        if (v.target.checked) {
            let newArr = [...selection, v.target.name]
            setSelection([...new Set(newArr)]);
            onChange({name:name, value:[...new Set(newArr)]})
        } else {
            setSelection(selection.filter(i => i != v.target.name))
            onChange({name:name, value:selection.filter(i => i != v.target.name)})
        }
    }
    // handle text on seletion
    useEffect(() => {
        let temp = options.filter(i=> selection.includes(i.id))
        setSelectionText(`is ${temp.map(item => item.label).toString()}`);
    }, [selection]);
    
    const clearSelection = () => {
        setSelection([]);
        onChange({name:name, value:[]})
    }

    return (
        <div className="relative">
            <div>
                <button onClick={handleOpenDropdown} className={`select-none text-xs py-1 px-2 rounded-corner border rounded-md inline-block m-[1px] ${selection.length > 0 ? 'border-stone-300 bg-stone-100': 'bg-stone-100 border-stone-200 border-dashed'}`}>{ title }<span className=" ml-1">{selectionText}</span></button>
            </div>
            {/* dropdown */}
            {isOpen && options.length > 0 && (<div ref={dropdownRef} className="generic-dropdown absolute top-[100%] bg-white border border-stone-300 left-0 rounded-md mt-[5px] z-[10]">
                <div className="overflow-hidden w-full p-4 grid gap-[5px]">
                    {/* <div className="text-sm mb-2">Sort by</div> */}
                    {options.map(option => (
                        <div key={`table-filters-${name}-${option.id}`} className="flex gap-[10px] flex-0-0-auto whitespace-nowrap">
                            <input type="checkbox" className="inline-block cursor-pointer" id={`filer-${option.id}`} name={option.id} onChange={handleSelection} checked={selection.includes(option.id)}/>
                            <label htmlFor={`filer-${option.id}`} className="text-sm inline-block overflow-ellipsis whitespace-nowrap text-sm text-stone-700 select-none cursor-pointer">
                                {option.label}
                            </label>
                        </div>
                    ))}
                    <div>
                        <button disabled={selection.length > 0 ? false:true} className={`mt-3 text-xs ${selection.length > 0 ? 'text-indigo-400 hover:text-indigo-500 cursor-pointer hover:underline':'text-stone-400'}`} onClick={clearSelection}>Clear</button>
                    </div>
                </div>
            </div>)
            }
        </div>

    );
};

TableFilterButton.propTypes = {
    type: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
};


export default TableFilterButton;
