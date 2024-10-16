import { useEffect, useState } from "react";
import UltimateSearch from "../components/ultimate_search"
import useFetchContainers from "../api/useFetchContainers";
import useFetchDepot from "../api/useFetchDepot";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Tooltip as ReactTooltip } from 'react-tooltip';
import FilterDropDown from "../components/table/filter_dropdown";
import Modal from "../components/modal";
import ImageUploader from '../components/images_upload/ImageUploader';
import axios from "axios";
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';

export function Home() {
    const API_URL = process.env.REACT_APP_API_URL;
    const base_url = API_URL + '/products';
    const { data: products, loading, error, pagination, refetch } = useFetchContainers(base_url);
    let { data: locations } = useFetchDepot();
    const [displayResults, setDisplayResults] = useState(false)
    const [listData, setListData] = useState(products);
    const [filterObject, setFilterObject] = useState([]);
    const [actionProcess, setActionProcess] = useState([]); // {id, action} > zoho_sync, set_generic_images
    // product editItem 
    const [editProduct, setEditProduct] = useState(null)
    // Modals
    // const [formModal,setFormModal] = useState(false);
    const [imgUploadModal, setImgUploadModal] = useState(false);
    
    useEffect(()=>{
        console.log("useEffectlistData", listData);
        setDisplayResults(true);
    },[listData]);

    useEffect(() => {
        console.log("products from useEffect", products);
        setListData(products);
    }, [products]);

    let filters = [];
    useEffect(() => {
        filters = [
            {
                title: "Location", name: 'location', default: [], options: locations.map(i => ({ id: i.title, label: i.title })), value: []
            },
            {
                title: "Condition", name: 'condition', default: [], options: [
                    { id: 'New', label: "New" },
                    { id: 'Used', label: "Used" },
                    { id: 'Refurbished', label: "Refurbished" },
                ], value: []
            },
            {
                title: "Size", name: 'length_width', default: [], options: [
                    { id: "10'", label: "10'" },
                    { id: "20'", label: "20'" },
                    { id: "40'", label: "40'" },
                    { id: "45'", label: "45'" },
                    { id: "53'", label: "53'" },
                ], value: []
            },
            {
                title: "Height", name: 'height', default: [], options: [
                    { id: `8' 6" Standard`, label: `8' 6" Standard` },
                    { id: `9' 6" High Cube (HC)`, label: `9' 6" High Cube (HC)` },
                ], value: []
            },
            {
                title: "Selection Type", name: 'selectionoptions', default: [], options: [
                    { id: 'First off the Stack (FO)', label: "First off the Stack (FO)" },
                    { id: 'Exclusive Pool (EP)', label: "Exclusive Pool (EP)" },
                    { id: 'You Pick (UP)', label: "You Pick (UP)" },
                ], value: []
            },
        ];
        setFilterObject(filters);
    }, [locations]);




    const findIndexByName = (array, name) => {
        return array.findIndex(item => item.name === name);
    };

    const handleFilterChange = (e) => {
        // console.log(`filter`, e.value);
        let temp = filterObject;
        let index = findIndexByName(temp, e.name)
        // console.log('index', index);
        // console.log("temp", temp);
        temp[index]['value'] = e.value;
        setFilterObject(prev => temp);
    }

    const handleOnSearch = (search) => {
        console.log("search", search);
    }

    const handleImgUploadClick = (product) => {
        // console.log("editProduct", product);
        setEditProduct(product);
        setImgUploadModal(true);
    }

    const handleTableImageUpdates = (data) => {
        console.log("handleTableImageUpdate", data);
        if (data?.["images"]) {
            let images_ids = data["images"].map(i => i.id);
            setListData(prevData =>
                prevData.map(i =>
                    parseInt(i.id) === parseInt(data.product_id) ? { ...i, images: data.images, images_ids } : i
                )
            );
        }

        if (data?.["image"]) {
            setListData(prevData =>
                prevData.map(i =>
                    parseInt(i.id) === parseInt(data.product_id) ? { ...i, image: data.image } : i
                )
            );
        }
    }

    const handleTableRowUpdates = (data) => {
        console.log("update row with this data", data);
        setListData(prevData =>
            prevData.map(i =>
                parseInt(i.id) === parseInt(data.id) ? { ...data } : i
            )
        );
    }

    const handleSetGenericImgClick = (product) => {
        // setProcessing(true);
        const product_id = product.id;
        if (product_id) {
            const action = { id: product_id, action: "set_generic_images" };
            setActionProcess(prev => [...prev, action]);
            const formData = new FormData();
            formData.append('product_id', product_id);
            formData.append('length_width', product['cf_length_width']);
            formData.append('grade', product['cf_grade']);
            formData.append('condition', product['cf_condition']);
            formData.append('selectionoptions', product['cf_selectionoptions']);
            formData.append('height', product['cf_height']);
            axios.post(API_URL + "/product_images/apply_generic_images", formData)
                .then((response) => {
                    // Handle the response
                    console.log("generic images response:", response);
                    let { updated } = response.data;
                    handleTableImageUpdates(updated);
                    setActionProcess(prev => prev.filter(i => i.id !== product.id && action === "set_generic_images"));
                    toast.success(`Set Generic Image Success! -- Container(${product_id}).`, {
                        position: "bottom-right"
                    });
                })
                .catch((error) => {
                    // Handle the error
                    console.error("generic images error:", error.response);
                    // console.log("message", message)
                    const { message } = error.response.data;
                    Swal.fire({
                        title: message,
                        text: "Set Generic Image Attachment feature did not find any relative product base on condition, grade, size and height from the published status. Please upload images instead."
                    });
                    setActionProcess(prev => prev.filter(i => i.id !== product.id && action === "set_generic_images"));
                    toast.error(`Set Generic Image Failed! -- Container(${product_id}).`, {
                        position: "bottom-right"
                    });
                });
        }
    }

    const handleZohoSyncClick = (product) => {
        console.log("handleZohoSync", product)
        const product_id = product.id;
        if (product_id) {
            const action = { id: product.id, action: "zoho_single_sync" };
            setActionProcess(prev => [...prev, action]);
            const formData = new FormData();
            formData.append('product_id', product_id);
            axios.post(API_URL + "/zoho-single-sync", formData)
                .then((response) => {
                    // Handle the response
                    console.log("zoho single sync response:", response);
                    // let { updated } = response.data;
                    // handleTableImageUpdates(updated);
                    setActionProcess(prev => prev.filter(i => i.id !== product.id && action === "zoho_single_sync"));

                    if (response.data.report.response_data.code === 0) { // success
                        handleTableRowUpdates(response.data.product);
                        toast.success(`Zoho Single Product Sync Successful! -- Container(${product_id}).`, {
                            position: "bottom-right"
                        });
                    } else {// error
                        toast.error(`Zoho Single Product Sync Failed! -- ${response.data.report.response_data.message} -- Container(${product_id}).`, {
                            position: "bottom-right"
                        });
                    }
                })
                .catch((error) => {
                    // Handle the error
                    console.error("zoho single sync error:", error.response);
                    // console.log("message", message)
                    setActionProcess(prev => prev.filter(i => i.id !== product.id && action === "zoho_single_sync"));
                    toast.error(`Zoho Single Product Sync Failed! -- Container(${product_id}).`, {
                        position: "bottom-right"
                    });
                });

        }
    }

    return (
        <div>
            {/* Toast container */}
            <ToastContainer></ToastContainer>
            {/* tooltips */}
            <ReactTooltip id="zoho-sync-tooltip" content="Zoho Sync" />
            <ReactTooltip id="edit-product-tooltip" content="Edit Product" />
            <ReactTooltip id="upload-images-tooltip" content="Upload Images" />
            <ReactTooltip id="generic-images-tooltip" content="Set Generic Images" />
            {/* modals */}
            <Modal isOpen={imgUploadModal} onChange={setImgUploadModal}>
                <ImageUploader update={editProduct} onUpdate={handleTableImageUpdates}></ImageUploader>
            </Modal>
            <div className="w-full bg-white">
                <div className="container mx-auto">
                    <div className="w-full px-1 py-4 flex justify-end items-center gap-1">
                        <button className="rounded text-white bg-red-600 py-1 px-3 border-[2px] border-red-600">Zoho Batch Sync</button>
                        <button className="rounded border-[2px] border-red-600 text-red-600 py-1 px-3">Add Product</button>
                    </div>
                </div>
            </div>
            <div className="w-full bg-red-500">
                <div className="container mx-auto">
                    <UltimateSearch onsearch={handleOnSearch}></UltimateSearch>
                </div>
            </div>
            {/* filters */}
            <div className="w-ful">
                <div className="container mx-auto">
                    <div className="w-full px-1 py-4 flex justify-center items-center gap-1">
                        {filterObject && filterObject.map((filter, index) => (<FilterDropDown key={`filter-dropdown-${filter.name}`} value={filterObject[index].value} title={filter.title} options={filter.options} type="multi" onChange={handleFilterChange} name={filter.name}></FilterDropDown>))}
                    </div>
                </div>
            </div>
            {
                loading ? <div>Loading Containers</div> :
                    <div className="w-full p-[20px]  text-[0.8em]">
                        {
                            displayResults && <>
                                {
                                    listData && listData.map((product) => (
                                        <div key={product?.id} className="w-full flex items-center py-2 px-1 mt-2 rounded-lg border border-stone-300">
                                            <div className="w-[60px] h-[60px]">
                                                {
                                                    product?.image && <img src={product?.image} alt="" className="object-contain w-[60px] h-[60px]" />
                                                }
                                            </div>
                                            <div className="w-[calc(100%-570px)] pl-[20px]">
                                                <div>
                                                    {product?.name}
                                                </div>
                                                <div>
                                                    <span className="font-semibold">SKU: </span>{product?.sku}
                                                </div>
                                            </div>
                                            <div className="w-[100px]">
                                                <div className="relative w-full h-full">
                                                    <div className="text-[0.8em] text-center">Stocks</div>
                                                    <div className={`font-bold text-center ${product?.stocks ? "text-stone-500" : "text-red-500"}`}>{product?.stocks || 0}</div>
                                                </div>
                                            </div>
                                            <div className="w-[100px] text-[1.5em] text-right font-semibold text-stone-500 p-1">
                                                ${product?.price}
                                            </div>
                                            <div className="w-[200px]">
                                                <div className="relative w-full h-full">
                                                    <div className="text-[0.8em] text-center">Zoho Sync</div>
                                                    <div className={`font-bold text-center ${product?.cf_zoho_link_id ? "text-green-500" : "text-red-500"}`}>{product?.cf_zoho_link_id ? "YES" : "NO"}</div>
                                                    <div className="text-center text-[0.8em]">
                                                        {product?.cf_zoho_sync_date ? product?.cf_zoho_sync_date : "--/--/-- --:--:--"}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="w-[50px]">
                                                <div className="text-center">
                                                    <button onClick={() => handleZohoSyncClick(product)} data-tooltip-id="zoho-sync-tooltip" className={`rounded text-center bg-red-600 text-white p-1 text-2xl ${actionProcess.filter(i => i.id === product.id && i.action === "zoho_single_sync").length > 0 ? "pointer-events-none" : ""}`}>
                                                        {
                                                            actionProcess.filter(i => i.id === product.id && i.action === "zoho_single_sync").length > 0 ? <Icon icon="gg:spinner-two" className="animate-spin" /> : <Icon icon="ic:round-sync" />
                                                        }
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex p-1 gap-1 w-[120px] justify-center">
                                                <div className="text-center">
                                                    <button data-tooltip-id="edit-product-tooltip" className="rounded text-center bg-red-600 text-white p-1 text-2xl">
                                                        <Icon icon="ic:baseline-edit" />
                                                    </button>
                                                </div>
                                                <div className="text-center">
                                                    <button onClick={() => handleImgUploadClick(product)} data-tooltip-id="upload-images-tooltip" className="rounded text-center bg-red-600 text-white p-1 text-2xl">
                                                        <Icon icon="ic:baseline-image" />
                                                    </button>
                                                </div>
                                                <div className="text-center">
                                                    <button onClick={() => handleSetGenericImgClick(product)} data-tooltip-id="generic-images-tooltip" className={`rounded text-center bg-red-600 text-white p-1 text-2xl ${actionProcess.filter(i => i.id === product.id && i.action === "set_generic_images").length > 0 ? "pointer-events-none" : ""}`}>
                                                        {
                                                            actionProcess.filter(i => i.id === product.id && i.action === "set_generic_images").length > 0 ? <Icon icon="gg:spinner-two" className="animate-spin" /> : <Icon icon="ic:baseline-image-search" />
                                                        }
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </>
                        }
                    </div>
            }
        </div>
    )
}