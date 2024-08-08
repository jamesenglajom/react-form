import React from 'react';

const Table = ({ data, columns, twClass }) => {
  return (
    <div className={`${twClass} w-full`}>
            <table className="w-full">
            <thead className="border-t border-b-[2px] border-slate-300">
                <tr>
                    {columns.map((column, index)=>
                        <th key={column.name+'-'+index} className={`${column.stype} text-xs py-2 text-slate-600`}>
                            <div className="flex items-center">
                                {index==0 && (
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
            <tbody>
                <tr>
                    <td>
                        <div></div>
                    </td>
                </tr>
            </tbody>
        </table>
        </div>
  );
};

export default Table;