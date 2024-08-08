import React from 'react';
import Table from "./index"; 
import InputField from "../form_elements/input_field"
const ProductsTable = () => {
    const columns = [
        {name: "name", label:"Name", style: ""},
        {name: "sku", label:"SKU", style: ""},
        {name: "stock", label:"Stock", style: ""},
        {name: "price", label:"Price", style: ""},
        {name: "categories", label:"Categories", style: ""},
        {name: "tags", label:"Tags", style: ""},
        {name: "date", label:"Date", style: ""},
        {name: "fb_sync", label:"Facebook Sync", style: ""},
      ];
    const data = [];
  return (
    <div className="rounded-lg border border-slate-300 shadow-md pb-3">
        {/* title & create button */}
        <div className='p-[7px] flex items-center justify-between'>
            <div className='text-lg font-bold'>Products</div>
            <div>
                <button className="px-3 py-1 text-xs font-bold bg-green-700 hover:bg-green-600 rounded text-white">Create</button>
            </div>
        </div>
        {/* search, filter, columns */}
        <div className="py-1 px-[4px] grid grid-cols-12 gap-1 sm:gap-0">
            <div className='col-span-12 pr-0 sm:pr-1 sm:col-span-8'>
                <InputField twClass="rounded" placeholder="Search..."></InputField>
            </div>
            <div className="col-span-12 sm:col-span-2">
                {/* dropdown filter button */}
                <button className="w-full hover:bg-slate-100 border-slate-400 border h-[30px] sm:border-r-[.5px] rounded-l text-xs">Filters</button>
            </div>
            <div className="col-span-12 sm:col-span-2">
                {/* dropdown filter button */}
                <button className="w-full hover:bg-slate-100 border-slate-400 border  h-[30px] sm:border-l-[.5px] rounded-r text-xs">Columns</button>
            </div>
        </div>
        {/* filter badges */}
        <div className="py-[1px] px-[3px]">
            <div className="select-none text-xs py-1 px-2 rounded-corner bg-slate-100 border-slate-200 border inline-block m-[1px] rounded">Seo Score: <span className="font-semibold ml-1">All</span></div>
            <div className="select-none text-xs py-1 px-2 rounded-corner bg-slate-100 border-slate-200 border inline-block  m-[1px] rounded">Readability Score: <span className="font-semibold ml-1">All</span></div>
            <div className="select-none text-xs py-1 px-2 rounded-corner bg-slate-100 border-slate-200 border inline-block  m-[1px] rounded">Category:<span className="font-semibold ml-1">All</span></div>
            <div className="select-none text-xs py-1 px-2 rounded-corner bg-slate-100 border-slate-200 border inline-block  m-[1px] rounded">Type:<span className="font-semibold ml-1">All</span></div>
            <div className="select-none text-xs py-1 px-2 rounded-corner bg-slate-100 border-slate-200 border inline-block  m-[1px] rounded">Stock Status:<span className="font-semibold ml-1">All</span></div>
        </div>
        <Table data={data} columns={columns} twClass="py-1"></Table>
    </div>
  );
};

export default ProductsTable;