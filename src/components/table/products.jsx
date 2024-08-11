import React from 'react';
import { useEffect,useState } from 'react';
import Table from "./index"; 
import TableSortButton from "./sort_button"; 
import FilterDropDown from "./filter_dropdown"; 
import { Icon } from '@iconify/react';
import useFetchData from '../../api/useFetchData';

const ProductsTable = () => {
    const base_url ='https://onsitestorage.com/wp-json/wp_to_react/v1/products';
    const sortable_properties = [
        {id:'name',label: 'Name Space cat'},
        {id:'price',label: 'Price'},
        {id:'post_status',label: 'Status'}
    ];
    const filters = [
        {title: "Seo Score", name: 'seo_score', default:[], options:[
            {id:'seo_ni',label:"Needs Improvement"},
            {id:'seo_ok',label:"OK"},
            {id:'seo_good',label:"Good"},
            {id:'seo_no_focus',label:"No Focus Key Phrase"},
            {id:'seo_pni',label:"Post No Indexed"}
        ], value:[] },
        {title: "Readability Score", name: 'readability_score', default:[], options:[
            {id:'read_ni',label:"Needs Improvement"},
            {id:'read_ok',label:"OK"},
            {id:'read_good',label:"Good"},
        ], value:[] },
        {title: "Category", name: 'category', default:[], options:[
            {id:'option1',label:"Option1"},
            {id:'option2',label:"Option2"},
            {id:'option3',label:"Option3"},
            {id:'option4',label:"Option4"},
            
        ], value:[] },
        {title: "Type", name: 'type', default:[], options:[
            {id:'option1',label:"Option1"},
            {id:'option2',label:"Option2"},
            {id:'option3',label:"Option3"},
            {id:'option4',label:"Option4"},
        ], value:[] },
        {title: "Stock Status", name: 'stock_status', default:[], options:[
            {id:'option1',label:"Option1"},
            {id:'option2',label:"Option2"},
            {id:'option3',label:"Option3"},
            {id:'option4',label:"Option4"},
        ], value:[] },
    ];
    const [url, setUrl] = useState(base_url);
    let { data, count, pagination, loading } = useFetchData(url);
    const [filterObject, setFilterObject] = useState(filters);
    const [filtering, setFiltering] = useState(false); // filter flag
    const [page, setPage] = useState(1);
    const [fetchError, setFetchError] = useState(false);
    const [search, setSearch] = useState("");
    const [searchfilter, setSearchFilter] = useState("hidden");
    const [filtertabs, setFilterTabs] = useState("");

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
            }else{
                result += '&' + new URLSearchParams({[key]: obj[key]}).toString();
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
        temp = temp.filter(i=> i.value.length > 0);
        temp = arrayToObject(temp);
        temp['page'] = page;
        // temp['orderby'] = value;
        // temp['order'] = value;
        return temp;
    }

    const refetchtable = () => {
        let params = generateUrlParams(getAllParams());
        let new_url = base_url+'?'+ params;
        console.log(params)
        setUrl(new_url)
    }

    const handleFilterChange = (e) => {
        let temp = filterObject;
        let index = findIndexByName(temp, e.name)
        temp[index]['value'] = e.value;
        setPage(1);
        setFiltering(!filtering);
        setFilterObject(temp);
    }

    const changePage = (to_page) => {
        setPage(to_page);
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
    }, [page,filtering]);

    const columns = [
        {name: "name", label:"Name", col_width: "min-w-[300px] max-w-[300px] w-[300px]",td_style:"p-[5px] text-xs font-semibold text-indigo-400"},
        {name: "sku", label:"SKU", col_width: "",td_style:"p-[5px] text-xs font-semibold text-indigo-400"},
        {name: "stock_status", label:"Stock", col_width: "",td_style:"p-[5px] text-xs font-semibold text-indigo-400"},
        {name: "price", label:"Price", col_width: "",td_style:"p-[5px] text-xs font-semibold text-indigo-400"},
        {name: "categories", label:"Categories", col_width: "",td_style:"p-[5px] text-xs font-semibold text-indigo-400"},
        // {name: "tags", label:"Tags", style: ""},
        // {name: "date", label:"Date", style: ""},
        // {name: "fb_sync", label:"Facebook Sync", style: ""},
      ];

  return (
    <div className="rounded-xl border border-stone-300 shadow-md pb-3">
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
            <div className={`${searchfilter} w-full relative` } >
                <input type="search" name="search" placeholder="Search..." className="w-full border rounded-md text-sm p-[4px]  border-stone-300 focus:outline-white"/>
                {loading && <Icon icon="fluent:spinner-ios-16-filled" className={`absolute spin right-[5px] text-lg top-[5px]`} /> }
            </div>
            <div className={`${searchfilter} min-w-[68px] flex items-center justify-end`} onClick={hideSearchFilter}>
                <button className="flex items-center border-[1px] border-gray-300 text-xs py-[6px] px-[8px] rounded-md text-gray-600">
                    Cancel
                </button>
            </div>
            {/*  filter tabs */}
            <div className={`${filtertabs} w-full`} >
                <div className="select-none text-xs py-1 px-3 rounded-full bg-gray-300 inline-block m-[1px] font-semibold"><span className="border-r border-stone-400 pr-[3px] mr-[3px]">All</span><span className="text-stone-400">5k+</span></div>
                <div className="select-none text-xs py-1 px-3 rounded-full hover:bg-gray-200 cursor-pointer inline-block  m-[1px] font-semibold"><span className="border-r border-stone-400 pr-[3px] mr-[3px]">Published</span><span className="text-stone-400">4k+</span></div>
                <div className="select-none text-xs py-1 px-3 rounded-full hover:bg-gray-200 cursor-pointer inline-block  m-[1px] font-semibold"><span className="border-r border-stone-400 pr-[3px] mr-[3px]">Drafts</span><span className="text-stone-400">5h+</span></div>
                <div className="select-none text-xs py-1 px-3 rounded-full hover:bg-gray-200 cursor-pointer inline-block  m-[1px] font-semibold"><span className="border-r border-stone-400 pr-[3px] mr-[3px]">Trashed</span><span className="text-stone-400">20+</span></div>
                {/* <div className="select-none text-xs py-1 px-3 rounded-full hover:bg-gray-200 cursor-pointer inline-block  m-[1px] font-semibold"><span className="border-r border-stone-400 pr-[3px] mr-[3px]">Published</span><span className="text-stone-400">4k+</span></div> */}
            </div>
            {/* flex items-center justify-end */}
            <div className={`${filtertabs} min-w-[54px] relative`} onClick={showSearchFilter}>
                {/* {loading==true &&  } */}
                {loading && <Icon icon="fluent:spinner-ios-16-filled" className={`absolute spin left-[-23px] text-lg top-[5px]`} /> }
                <button className="flex items-center border-[1px] border-gray-300 text-lg py-[5px] px-[8px] rounded-md text-gray-600">
                    <Icon icon="fluent:search-16-filled" />
                    <Icon icon="fluent:filter-16-filled" />
                </button>
            </div>
            {/* sort and paginate buttons */}
            <div className={`${''} min-w-[118px] flex items-center justify-end`}>
                <TableSortButton options={sortable_properties} type="multi" onChange={handleFilterChange}></TableSortButton>
                <button disabled={pagination.prev ? false:true} onClick={()=> changePage(pagination.prev)} className="flex items-center border-[1px] border-gray-300 text-lg py-[5px] px-[8px] rounded-l-md text-gray-600">
                <Icon icon="fluent:chevron-left-16-filled" />
                </button>
                <button  disabled={pagination.next ? false:true} onClick={()=> changePage(pagination.next)} className="flex items-center border-[1px] border-gray-300 text-lg py-[5px] px-[8px] rounded-r-md text-gray-600">
                <Icon icon="fluent:chevron-right-16-filled" />
                </button>
            </div>
        </div>
        {/* search and filter filter badges */}
        <div className={`${searchfilter} py-[1px] px-[3px] flex`}>
            {filters && filters.map(filter =>(<FilterDropDown key={`filter-dropdown-${filter.name}`} title={filter.title} options={filter.options} type="multi" onChange={handleFilterChange} name={filter.name}></FilterDropDown>))}
        </div>
        <Table data={data} columns={columns} twClass="py-1"></Table>
    </div>
  );
};

export default ProductsTable;