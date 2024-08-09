import React from 'react';
import { useState } from 'react';
import Table from "./index"; 
import InputField from "../form_elements/input_field"
import { Icon } from '@iconify/react';
const ProductsTable = () => {
    const [searchfilter, setSearchFilter] = useState("hidden");
    const [filtertabs, setFilterTabs] = useState("");

    const showSearchFilter = () => {
        setSearchFilter("")
        setFilterTabs("hidden")
    }

    const hideSearchFilter = () => {
        setSearchFilter("hidden")
        setFilterTabs("")
    }
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
    <div className="rounded-xl border border-slate-300 shadow-md pb-3">
        {/* title & create button */}
        {/* <div className='p-[7px] flex items-center justify-between'>
            <div className='text-lg font-bold'>Products</div>
            <div>
                <button className="px-3 py-1 text-xs font-bold bg-green-700 hover:bg-green-600 rounded text-white">Create</button>
            </div>
        </div> */}
        {/* search, filter, columns */}
        <div className="py-1 px-[4px] flex items-center">
            {/* search and filter */}
            <div className={`${searchfilter} w-full`} >
                <InputField twClass="rounded" placeholder="Search..."></InputField>
            </div>
            <div className={`${searchfilter} min-w-[58px] flex items-center justify-end`} onClick={hideSearchFilter}>
                <button class="flex items-center border-[1px] border-gray-300 text-xs py-[6px] px-[8px] rounded-md shadow text-gray-600">
                    Cancel
                </button>
            </div>
            {/*  filter tabs */}
            <div className={`${filtertabs} w-full`} >
                <div className="select-none text-xs py-1 px-3 rounded-full bg-gray-300 inline-block m-[1px] font-semibold"><span className="border-r border-slate-400 pr-[3px] mr-[3px]">All</span><span className="text-slate-400">5k+</span></div>
                <div className="select-none text-xs py-1 px-3 rounded-full hover:bg-gray-200 cursor-pointer inline-block  m-[1px] font-semibold"><span className="border-r border-slate-400 pr-[3px] mr-[3px]">Published</span><span className="text-slate-400">4k+</span></div>
                <div className="select-none text-xs py-1 px-3 rounded-full hover:bg-gray-200 cursor-pointer inline-block  m-[1px] font-semibold"><span className="border-r border-slate-400 pr-[3px] mr-[3px]">Drafts</span><span className="text-slate-400">5h+</span></div>
                <div className="select-none text-xs py-1 px-3 rounded-full hover:bg-gray-200 cursor-pointer inline-block  m-[1px] font-semibold"><span className="border-r border-slate-400 pr-[3px] mr-[3px]">Trashed</span><span className="text-slate-400">20+</span></div>
                {/* <div className="select-none text-xs py-1 px-3 rounded-full hover:bg-gray-200 cursor-pointer inline-block  m-[1px] font-semibold"><span className="border-r border-slate-400 pr-[3px] mr-[3px]">Published</span><span className="text-slate-400">4k+</span></div> */}
            </div>
            <div className={`${filtertabs} min-w-[59px] flex items-center justify-end`} onClick={showSearchFilter}>
                <button class="flex items-center border-[1px] border-gray-300 text-lg py-[5px] px-[8px] rounded-md shadow text-gray-600">
                    <Icon icon="fluent:search-16-filled" />
                    <Icon icon="fluent:filter-16-filled" />
                </button>
            </div>
            {/* sort button */}
            <div className={`${''} min-w-[41px] flex items-center justify-end`}>
                <button class="flex items-center border-[1px] border-gray-300 text-lg py-[5px] px-[8px] rounded-md shadow text-gray-600">
                <Icon icon="fluent:arrow-sort-16-filled" />
                </button>
            </div>
        </div>
        {/* search and filter filter badges */}
        <div className={`${searchfilter} py-[1px] px-[3px]`}>
            <div className="select-none text-xs py-1 px-2 rounded-corner bg-slate-100 border-slate-200 border inline-block m-[1px]">Seo Score: <span className="font-semibold ml-1">All</span></div>
            <div className="select-none text-xs py-1 px-2 rounded-corner bg-slate-100 border-slate-200 border inline-block  m-[1px]">Readability Score: <span className="font-semibold ml-1">All</span></div>
            <div className="select-none text-xs py-1 px-2 rounded-corner bg-slate-100 border-slate-200 border inline-block  m-[1px]">Category:<span className="font-semibold ml-1">All</span></div>
            <div className="select-none text-xs py-1 px-2 rounded-corner bg-slate-100 border-slate-200 border inline-block  m-[1px]">Type:<span className="font-semibold ml-1">All</span></div>
            <div className="select-none text-xs py-1 px-2 rounded-corner bg-slate-100 border-slate-200 border inline-block  m-[1px]">Stock Status:<span className="font-semibold ml-1">All</span></div>
        </div>
        <Table data={data} columns={columns} twClass="py-1"></Table>
    </div>
  );
};

export default ProductsTable;