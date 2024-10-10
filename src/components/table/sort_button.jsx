// TableSortButton.jsx
import React from "react";
import PropTypes from "prop-types";
import { Icon } from '@iconify/react';
import { useEffect, useState, useRef } from 'react';
// prop type not yet implemented
// options: array, type: string
const TableSortButton = ({ options, onChange, value, disabled }) => {
    const [isOpen, setIsOpen] = useState(false);
    const orders = [
        {id:"asc", tooltip:'Ascending', icon:'fluent:text-sort-ascending-16-filled', label: "AZ"},
        {id:"desc",tooltip:'Descending', icon:'fluent:text-sort-descending-16-filled', label: "ZA"}
    ];
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
        onChange(v)
    }

    return (
        <div className="relative">
            {/* <button onClick={handleOpenDropdown} className="flex items-center border-[1px] border-gray-300 text-lg py-[5px] px-[8px] rounded-md text-gray-600 mr-[5px]"> */}
            <button onClick={handleOpenDropdown} className="table-sort-button">
                <Icon icon="fluent:arrow-sort-16-filled" />
            </button>
            {isOpen && (<div ref={dropdownRef} className="generic-dropdown absolute top-[100%] bg-white border border-stone-300 right-0 rounded-md mt-[5px] z-[10]">
                <div className="overflow-hidden w-full p-3 grid gap-[5px]">
                    <div className="text-sm mb-2">Sort by</div>
                    {options.map(option => (
                        <div key={`table-sort-option-${option.id}`} className="flex gap-[10px] flex-0-0-auto whitespace-nowrap">
                            <input type="radio" disabled={disabled} className="inline-block cursor-pointer" checked={value.orderby === option.id} value={option.id} id={`table-sort-option-${option.id}`} name="sort-orderby-radio" onChange={()=> handleSelection({orderby:    option.id})}/>
                            <label htmlFor={`table-sort-option-${option.id}`} className="text-sm inline-block overflow-ellipsis whitespace-nowrap text-stone-700 select-none cursor-pointer">
                                {option.label}
                            </label>
                        </div>
                    ))}
                </div>
                
                <div className="border-t border-stone-300 min-w-[110px] p-3">
                    {
                        orders.map((order,index)=>(
                            <div key={`sort-order-radio-wrap-${order.id}`}>
                                <label htmlFor={`sort-order-option-${order.id}`}>
                                    <input type="radio" className="hidden" id={`sort-order-option-${order.id}`} name="sort-order-radio" value={order.id} checked={value.order === order.id} onChange={()=> handleSelection({order:order.id})}/>
                                    <button disabled={disabled || value.order === order.id} className={`table-sort-order-button ${value.order === order.id ? 'active':''} ${orders.length !== index +1 && 'mb-1'}`} onClick={()=> handleSelection({order:order.id})}>
                                        <div className={`mr-3`}>
                                            <Icon icon={order.icon}></Icon>
                                        </div>
                                        <div>
                                            {order.label}
                                        </div>
                                    </button>
                                </label>
                            </div>
                        ))
                    }

                </div>
            </div>)
            }
        </div>

    );
};

TableSortButton.propTypes = {
    value: PropTypes.object.isRequired,
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
};


export default TableSortButton;
