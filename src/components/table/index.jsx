import React from 'react';

const Table = ({ data, columns, twClass, onEditProductClick, onEditImageClick }) => {
    const handleEditProductClick = (product) => {
        onEditProductClick(product)
    }
    const handleEditImageClick = (product) => {
        onEditImageClick(product)
    }
    return (
        <div className={`${twClass} w-full overflow-x-auto`}>
            <table className="w-full">
                <thead className="border-t border-b-[2px] border-stone-300">
                    <tr>
                        {columns.map((column, index) =>
                            <th key={column.name + '-' + index} className={`${column.th_style} text-xs py-2 text-stone-600 bg-stone-200`}>
                                <div className="flex items-center">
                                    {index == 0 && (
                                        <div className="pr-2">
                                            <input type="checkbox" />
                                        </div>
                                    )}
                                    <div className={`${column.th_align} w-full`}>{column.label}</div>
                                </div>
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody className="relative">
                    {data.map((drow, rowindex) => (<tr key={`tr-products-table-${rowindex}`} className="bg-white hover:bg-stone-100 border-b border-stone-200">
                        {columns.map((col, index) => {
                            let { Component } = col;
                            return Component ? (
                            <td key={`td-products-table-${col.name}`} className={col.td_style}>
                                    <div>
                                    <Component key={`td-dc-products-table-${col.name}`} data={drow}/>
                                    {
                                        index === 0 && <div className="flex gap-3">
                                            <div className="cursor-pointer" onClick={()=> handleEditProductClick(drow)}>Edit</div>
                                            <div className="cursor-pointer" onClick={()=> handleEditImageClick(drow)}>Update Images</div>
                                        </div>
                                    }
                                    </div>
                                </td>
                            ) : (
                            <td key={`td-products-table-${col.name}`} className={col.td_style}>
                                {
                                    col.name.toLowerCase() === "categories" ?
                                    <div>{drow[col.name].join(" | ")}</div>
                                    :
                                    <div>{drow[col.name]}</div>
                                }
                            </td>
                            )
                        })}
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;