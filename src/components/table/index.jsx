import React from 'react';

const Table = ({ data, columns, twClass }) => {
    return (
        <div className={`${twClass} w-full`}>
            <table className="w-full">
                <thead className="border-t border-b-[2px] border-stone-300">
                    <tr>
                        {columns.map((column, index) =>
                            <th key={column.name + '-' + index} className={`${column.col_width} text-xs py-2 text-stone-600 bg-stone-200`}>
                                <div className="flex items-center">
                                    {index == 0 && (
                                        <div className="pr-2">
                                            <input type="checkbox" />
                                        </div>
                                    )}
                                    <div>{column.label}</div>
                                </div>
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody className="relative">
                    {data.map((drow, rowindex) => (<tr key={`tr-products-table-${rowindex}`} className="bg-white hover:bg-slate-100">
                        {columns.map((col, index) => (
                            <td key={`td-products-table-${col.name}`} className={`${col.td_style} `}>{drow[col.name]}</td>
                        ))}
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;