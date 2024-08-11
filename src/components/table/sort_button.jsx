// TableSortButton.jsx
import React from "react";
import PropTypes from "prop-types";
import { Icon } from '@iconify/react';
import { useEffect, useState, useRef } from 'react';
// prop type not yet implemented
// options: array, type: string
const TableSortButton = ({ options, type, onChange }) => {
    const [selection, setSelection] = useState([]);
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
            onChange([...new Set(newArr)])
        } else {
            setSelection(selection.filter(i => i != v.target.name))
            onChange(selection.filter(i => i != v.target.name))
        }
    }

    const clearSelection = () => {
        setSelection([]);
    }

    return (
        <div className="relative">
            <button onClick={handleOpenDropdown} className="flex items-center border-[1px] border-gray-300 text-lg py-[5px] px-[8px] rounded-md text-gray-600 mr-[5px]">
                <Icon icon="fluent:arrow-sort-16-filled" />
            </button>
            {isOpen && (<div ref={dropdownRef} className="generic-dropdown absolute top-[100%] bg-white border border-stone-300 right-0 rounded-md mt-[5px] z-[10]">
                <div className="overflow-hidden w-full p-4 grid gap-[5px]">
                    {/* <div className="text-sm mb-2">Sort by</div> */}
                    {options.map(option => (
                        <div key={`table-sort-option-${option.id}`} className="flex gap-[10px] flex-0-0-auto whitespace-nowrap">
                            <input type="checkbox" className="inline-block cursor-pointer" id={`filer-${option.id}`} name={option.id} onChange={handleSelection} />
                            <label htmlFor={`filer-${option.id}`} className="text-sm inline-block overflow-ellipsis whitespace-nowrap text-sm text-stone-700 select-none cursor-pointer">
                                {option.label}
                            </label>
                        </div>
                    ))}
                    <div>
                        <button className="mt-3 text-xs text-stone-400" onClick={clearSelection}>Clear</button>
                    </div>
                </div>
            </div>)
            }
        </div>

    );
};

TableSortButton.propTypes = {
    type: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
};


export default TableSortButton;
