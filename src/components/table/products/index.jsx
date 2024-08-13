import React from 'react';
import { useEffect, useState, useCallback } from 'react';
import Table from "../../table/index";
import TableSortButton from "../../table/sort_button";
import FilterDropDown from "../../table/filter_dropdown";
import { Icon } from '@iconify/react';
import useFetchData from '../../../api/useFetchData';
import Modal from "../../modal/index"
import ProductsDetailsForm from "../../form/product_details";
import tdName from "../products/td_name"
import tdPrice from "../products/td_price"
import ProductTableTabs from '../tabs';


const ProductsTable = () => {
    const base_url = 'https://onsitestorage.com/wp-json/wp_to_react/v1/products';
    const tabs = [
        { id: 'all', label: "All" },
        { id: 'publish', label: "Published" },
        { id: 'draft', label: "Drafts" },
        { id: 'private', label: "Private" },
        { id: 'trash', label: "Trash" },
    ];
    const filters = [
        {
            title: "Seo Score", name: 'seo_score', default: [], options: [
                { id: 'seo_ni', label: "Needs Improvement" },
                { id: 'seo_ok', label: "OK" },
                { id: 'seo_good', label: "Good" },
                { id: 'seo_no_focus', label: "No Focus Key Phrase" },
                { id: 'seo_pni', label: "Post No Indexed" }
            ], value: []
        },
        {
            title: "Readability Score", name: 'readability_score', default: [], options: [
                { id: 'read_ni', label: "Needs Improvement" },
                { id: 'read_ok', label: "OK" },
                { id: 'read_good', label: "Good" },
            ], value: []
        },
        {
            title: "Category", name: 'category', default: [], options: [
                { id: 'option1', label: "Option1" },
                { id: 'option2', label: "Option2" },
                { id: 'option3', label: "Option3" },
                { id: 'option4', label: "Option4" },

            ], value: []
        },
        {
            title: "Type", name: 'type', default: [], options: [
                { id: 'option1', label: "Option1" },
                { id: 'option2', label: "Option2" },
                { id: 'option3', label: "Option3" },
                { id: 'option4', label: "Option4" },
            ], value: []
        },
        {
            title: "Stock Status", name: 'stock_status', default: [], options: [
                { id: 'option1', label: "Option1" },
                { id: 'option2', label: "Option2" },
                { id: 'option3', label: "Option3" },
                { id: 'option4', label: "Option4" },
            ], value: []
        },
    ];
    const sorter = [
        { id: "name", label: "Name" },
        { id: "sku", label: "SKU" },
        { id: "price", label: "Price" },
        { id: "published_date", label: "Publish Date" },
        { id: "modified_date", label: "Modified Date" },
    ];
    const [url, setUrl] = useState(base_url);
    let { data, pagination, loading, statistics } = useFetchData(url);
    const [search, setSearch] = useState("");
    const [post_status, setPostStatus] = useState({ post_status: "all" });
    const [filterObject, setFilterObject] = useState(filters);
    const [sort, setSort] = useState({ orderby: 'modified_date', order: 'asc' });
    const [refetchFlag, setRefetchFlag] = useState(false); // filter flag
    const [page, setPage] = useState(1);
    const [searchfilter, setSearchFilter] = useState("hidden");
    const [filtertabs, setFilterTabs] = useState("");
    const [openFormModal, setOpenFormModal] = useState(false)

    const handleSearch = (e) => {
        setPage(1);
        setSearch(e.target.value)
        setRefetchFlag(!refetchFlag);
    }

    const handleTabSelect = (e) => {
        const { value } = e.target;
        const v = { post_status: value };
        setPage(1);
        setPostStatus(v)
        setRefetchFlag(!refetchFlag);
    }

    const findIndexByName = (array, name) => {
        return array.findIndex(item => item.name === name);
    };

    const generateUrlParams = (obj) => {
        let result = "";
        for (const key in obj) {
            if (Array.isArray(obj[key])) { // Check if key is an own property
                obj[key].forEach((item, index) => {
                    result += `&${key}[]=${item}`;
                });
            } else {
                result += '&' + new URLSearchParams({ [key]: obj[key] }).toString();
            }
        }
        return result;
    }

    const arrayToObject = (arr) => {
        return arr.reduce((accumulator, item) => {
            accumulator[item.name] = item.value;
            return accumulator;
        }, {});
    };


    const getAllParams = () => {
        let temp = filterObject;
        // remove properties with no values
        temp = temp.filter(i => i.value.length > 0);
        temp = arrayToObject(temp);
        temp['page'] = page;
        temp = { ...temp, ...sort };
        temp = { ...temp, ...post_status };
        if (search != "") {
            temp['search'] = search;
        }
        return temp;
    }

    const refetchtable = () => {
        let params = generateUrlParams(getAllParams());
        let new_url = base_url + '?' + params;
        console.log(params)
        setUrl(new_url)
    }

    const handleFilterChange = (e) => {
        let temp = filterObject;
        let index = findIndexByName(temp, e.name)
        temp[index]['value'] = e.value;
        setPage(1);
        setRefetchFlag(!refetchFlag);
        setFilterObject(temp);
    }

    const handleSortChange = (v) => {
        let temp = sort, vtemp = Object.entries(v).pop();
        temp[vtemp[0]] = vtemp[1];
        setRefetchFlag(!refetchFlag);
        setSort(temp);
    }

    const changePage = (to_page) => {
        setPage(to_page);
        setRefetchFlag(!refetchFlag);
    }

    const showSearchFilter = () => {
        setSearchFilter("")
        setFilterTabs("hidden")
    }

    const hideSearchFilter = () => {
        setSearchFilter("hidden")
        setFilterTabs("")
    }

    useEffect(() => {
        refetchtable();
    }, [refetchFlag]);

    const columns = [
        { Component: tdName, name: "name", label: "Name", th_style: "min-w-[450px] max-w-[450px] w-[450px]", th_align: "text-left", td_style: "p-[5px] text-xs font-semibold text-indigo-400" },
        { Component: tdPrice, name: "price", label: "Price", th_style: "min-w-[200px] max-w-[200px] w-[200px] text-center justify-center", th_align: "text-center", td_style: "p-[5px] text-xs font-semibold text-indigo-400 justify-center text-center" },
        { Component: null, name: "categories", label: "Categories", th_style: "", th_align: "text-left", td_style: "p-[5px] text-xs font-semibold text-indigo-400" },
    ];

    return (
        <>
            <div className="rounded-xl border border-stone-300 shadow-md pb-3">
                {/* title & create button */}
                <div className='p-[7px] flex items-center justify-between'>
                    <div className='text-lg font-bold'>Products</div>
                    <div>
                        <button onClick={() => setOpenFormModal(true)} className="px-3 py-1 text-xs font-bold bg-green-700 hover:bg-green-600 rounded text-white">Create</button>
                    </div>
                </div>
                {/* search, filter, columns */}
                <div className="py-1 px-[4px] flex items-center">
                    {/* search and filter */}
                    <div className={`${searchfilter} w-full relative`} >
                        <input type="search" name="search" placeholder="Search..." className="w-full border rounded-md text-sm p-[4px]  border-stone-300 focus:outline-white" value={search} onChange={handleSearch} />
                        {loading && <Icon icon="fluent:spinner-ios-16-filled" className={`absolute spin right-[5px] text-lg top-[5px]`} />}
                    </div>
                    <div className={`${searchfilter} min-w-[68px] flex items-center justify-end`} onClick={hideSearchFilter}>
                        <button className="flex items-center border-[1px] border-gray-300 text-xs py-[6px] px-[8px] rounded-md text-gray-600">
                            Cancel
                        </button>
                    </div>
                    {/*  filter tabs */}
                    <ProductTableTabs toggle={filtertabs} tabs={tabs} stats={statistics} value={post_status} onChange={handleTabSelect} disabled={loading}></ProductTableTabs>
                    {/* flex items-center justify-end */}
                    <div className={`${filtertabs} min-w-[54px] relative`} onClick={showSearchFilter}>
                        {/* {loading==true &&  } */}
                        {loading && <Icon icon="fluent:spinner-ios-16-filled" className={`absolute spin left-[-23px] text-lg top-[5px]`} />}
                        <button className="flex items-center border-[1px] border-gray-300 text-lg py-[5px] px-[8px] rounded-md text-gray-600">
                            <Icon icon="fluent:search-16-filled" />
                            <Icon icon="fluent:filter-16-filled" />
                        </button>
                    </div>
                    {/* sort and paginate buttons */}
                    <div className={`${''} min-w-[118px] flex items-center justify-end`}>
                        <TableSortButton options={sorter} type="multi" onChange={handleSortChange} value={sort} disabled={loading}></TableSortButton>
                        <button disabled={pagination.prev ? false : true} onClick={() => changePage(pagination.prev)} className="flex items-center border-[1px] border-gray-300 text-lg py-[5px] px-[8px] rounded-l-md text-gray-600">
                            <Icon icon="fluent:chevron-left-16-filled" />
                        </button>
                        <button disabled={pagination.next ? false : true} onClick={() => changePage(pagination.next)} className="flex items-center border-[1px] border-gray-300 text-lg py-[5px] px-[8px] rounded-r-md text-gray-600">
                            <Icon icon="fluent:chevron-right-16-filled" />
                        </button>
                    </div>
                </div>
                {/* search and filter filter badges */}
                <div className={`${searchfilter} py-[1px] px-[3px] flex flex-wrap`}>
                    {filters && filters.map((filter, index) => (<FilterDropDown key={`filter-dropdown-${filter.name}`} value={filterObject[index].value} title={filter.title} options={filter.options} type="multi" onChange={handleFilterChange} name={filter.name}></FilterDropDown>))}
                </div>
                <Table data={data} columns={columns} twClass="py-1"></Table>
            </div>
            <Modal isOpen={openFormModal} onChange={setOpenFormModal}>
                <ProductsDetailsForm></ProductsDetailsForm>
            </Modal>
        </>
    );
};

export default ProductsTable;