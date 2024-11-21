import React, { useState, useEffect, useRef } from "react";
import InputField from "../form_elements/input_field";
import DropdownField from "../form_elements/dropdown_field";
import CheckboxField from "../form_elements/checkbox_field";
import ToggleField from "../form_elements/toggle_field";
import CategoryField from "../form_elements/category_field";
import { form_object, form_fields } from "../../static/product_details_form";
import axios from "axios";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import FormRadio from "../form_elements/form_radio";
import { Icon } from "@iconify/react/dist/iconify.js";
import AccessoryForm from "../form/accessory"

const ProductsDetailsForm = ({ locations, categories, update, onUpdate, onAddProduct }) => {
  const MySwal = withReactContent(Swal)
  const lockedCategory = 18;
  const unwantedCategories = [15,308,327,328,329,330];
  const accessoryCatId = 308;
  const containerCatId = 18;
  // const modificationCatId = null;
  const containerFormTabRef = useRef(null);
  const accessoryFormTabRef = useRef(null);
  const modificationFormTabRef = useRef(null);

  
  // Primary and secondary tab states
  const [activePrimaryTab, setActivePrimaryTab] = useState('Shipping Container');

  // Primary and secondary tab arrays
  const primaryTabs = [
    {name:'Shipping Container', ref: containerFormTabRef},
    {name:'Accessory', ref: accessoryFormTabRef},
    {name:'Modification', ref: modificationFormTabRef}
  ];

  let default_form_values = form_fields.reduce(
    (acc, field) => ({ ...acc, [field.property_name]: field.value ?? "" }),
    {}
  );
  const [formData, setFormData] = useState({});
  const [containerCategories, setContainerCategories] = useState([]);

  const toFormHeight = (height) => {
    return height.includes("Standard") ? "standard" : "highcube";
  }

  const selection_type_options = [
    { value: "FO", label: "First off the Stack (FO)" },
    { value: "EP", label: "Exclusive Pool (EP)" },
    { value: "UP", label: "You Pick (UP)" },
  ];

  const toFormSelectionOptions = (data) => {
    let selectionoptions = data;
    let result = "FO";
    if (selectionoptions) {
      let filtered_items = selection_type_options.filter(i=> i["label"] === selectionoptions);
      result = filtered_items.length > 0 ? filtered_items[0]?.["value"]: "FO";
    }
    return result;
  }

  const populateData = (data) => {
    console.log("data to populate", data);
    let form_payment_type = "buy";
    if (data["cf_payment_type"]) {
      if (data["cf_payment_type"] !== "buy") {
        form_payment_type = `${data["cf_payment_type"]}-${data["cf_payment_term"][0]}`;
        // console.log(form_payment_type);
      }
    }

    return {
      title: data["name"] ?? "",
      price: data["price"] ?? 0,
      categories: data["categories_ids"] ?? [],
      store_id: data?.["cf_store_id"] ?? 123 ,
      condition: data["cf_condition"] ?? "",
      container_grade_title: data["cf_container_grade_title"] ?? "",
      container_title: data["cf_container_title"] ?? "",
      container_type: data["cf_type_selectiontype"] ?? "",
      doortype: data["cf_doortype"] ?? "",
      grade: data["cf_grade"] ?? "Wind and Water tight (WWT)",
      form_height: data["cf_height"] ? toFormHeight(data["cf_height"]) : "standard",
      length_width: data["cf_length_width"] ?? "20'",
      location: data["cf_location"] ?? "Abilene, TX",
      payment_type: form_payment_type,
      reefer_container: data["cf_reefer_container"],
      reefer_container_status: data["cf_reefer_container_status"],
      sales_tags: data["cf_sales_tags"] ? data["cf_sales_tags"].toLowerCase() : "",
      form_selectionoptions: toFormSelectionOptions(data["cf_selectionoptions"]) ?? "FO",
      sku: data["sku"] ?? "",
    }
  }


  useEffect(() => {
    setSelectedDepotDetails(null);
    if (locations && locations.length > 0) {
      // sort locations
      locations.sort((a, b) => a.title.localeCompare(b.title));
      let filter_location = [];
      if (!update) {
        default_form_values["location"] = locations[0]["title"];
        containerFormTabRef.current.disabled = false;
        accessoryFormTabRef.current.disabled = false;
        modificationFormTabRef.current.disabled = false;
      } else {
        let updateProductCategories = update.categories_ids;
        let productType = "container";
        if(updateProductCategories.includes(containerCatId)){
          productType="container";
        }else if(updateProductCategories.includes(accessoryCatId)){
          productType="accessory";
        }

        if(productType ==="container"){
          default_form_values = populateData(update);
          setActivePrimaryTab("Shipping Container");
          accessoryFormTabRef.current.disabled = true;
          modificationFormTabRef.current.disabled = true;
        }else if(productType ==="accessory"){
          setActivePrimaryTab("Accessory");
          containerFormTabRef.current.disabled = true;
          modificationFormTabRef.current.disabled = true;
        }
      }

      filter_location = locations.filter(i => i.title === default_form_values?.["location"]);
      if (filter_location.length > 0) {
        const details = filter_location[0];
        if (isValidJSON(details["custom"])) {
          details["custom"] = JSON.parse(details["custom"]);
        } else {
          details["custom"] = details["custom"];
        }
        setSelectedDepotDetails(details);
      }
      setFormData(default_form_values);
    }
  }, [locations]);


  useEffect(() => {
    // set and remove categories
    if(categories){
      // remove unwantedCategories
      let con_cat = categories.filter(i=> !unwantedCategories.includes(i.id));
      setContainerCategories(con_cat);
  }
    if (categories.length === 0) {
      setFormData(prev => ({ ...prev, categories: [lockedCategory] }));
    }
  }, [categories]);


  const [disableSubmit, setDisableSubmit] = useState(false);


  const [requestError, setRequestError] = useState({});



  const transformHeightString = (input) => {
    return input.replace(/"/g, '\\"'); // Replace double quotes with escaped double quotes
  };


  // const [formData, setFormData] = useState(default_form_values);
  // insert location options
  form_object[2]["elements"][0]["selection"] = locations.map(i => ({ id: i.title, label: i.title }));

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("formatted data: ", formatData(formData));
    createUpdateProduct(formatData(formData));
  };

  useEffect(() => {
    handleResponseError();
  }, [requestError]);

  const handleResponseError = () => {
    if (requestError.code == 400) {
      if (requestError.message === "DUPLICATE_SKU") {
        let dupli_html = "";
        requestError.data.duplicates.forEach((v, i) => {
          dupli_html += `
          <div class="table w-full border-collapse border border-gray-500 rounded-md mt-1 mb-1">
            <div class="table-row">
              <div class="table-cell text-left p-1 font-semibold">
              Product ID
              </div>
              <div class="table-cell text-left p-1">
              ${v.id}
              </div>
            </div>
            <div  class="table-row">
              <div class="table-cell text-left p-1 font-semibold">
              Post Status
              </div>
              <div class="table-cell text-left p-1">
              ${v.status}
              </div>
            </div>
            <div  class="table-row">
              <div class="table-cell text-left p-1 font-semibold">
              SKU
              </div>
              <div class="table-cell text-left p-1">
              ${v.sku}
              </div>
            </div>
          </div>
          `
        });
        MySwal.fire({
          title: requestError.data.title,
          html: `
          <div class="w-full text-left">Duplicate Items</div>
          ${dupli_html}
          `
        })
      }
    }
  }

  const createUpdateProduct = async (data) => {
    setDisableSubmit(true);
    let API_URL = process.env.REACT_APP_API_URL + "/product";
    if (data["id"]) {
      API_URL = API_URL + "/" + data["id"];
    }
    try {
      const response = await axios.post(API_URL, data, {
        headers: {
          'Content-Type': 'application/json',
        }
      }).then((response) => {
        // Handle the response
        setDisableSubmit(false);
        // console.log("update details response:", response.data);
        if (update) {
          let populated_data = populateData(response.data.product);
          setFormData(populated_data);
          onUpdate(response.data.product);
        } else {
          setFormData(default_form_values);
          onAddProduct(response.data.product);
        }
      }).catch((error) => {
        // Handle the error
        // console.error("update details error:", error);
        setDisableSubmit(false);
        if (error.response.data.code == 400) {
          setRequestError(error.response.data);
        }
      });
      // console.log("Successfully Created");
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const toFormattedSelectionOptions = (data) => {
    let filtered_items = selection_type_options.filter(i=> i["value"]===data);
    let result = "First off the Stack (FO)";
    if(filtered_items.length > 0){
      result = filtered_items[0]?.["label"];
      if(!result){
        result = "First off the Stack (FO)";
      }
    }
    return result
  }

  const formatData = (data) => {
    const tmp_data = data;
    let tmp_custom_fields = {};
    let data_keys = [];
    // set default value for property
    tmp_data["is_product_rent-to-own"] = false;
    tmp_data["store_id"] = 121; // vna
    // handle store id
    if (tmp_data["location"]) {
      tmp_data["store_id"] = locations.filter(i => i.title === tmp_data["location"])[0].id;
    }
    // set true height values
    tmp_data["height"] = tmp_data["form_height"] === "standard" ? `8' 6" Standard` : `9' 6" High Cube (HC)`;
    // set true selectionoptions values
    tmp_data["selectionoptions"] = toFormattedSelectionOptions(tmp_data["form_selectionoptions"]);
    // handle container type
    tmp_data["type"] = tmp_data["container_type"];
    tmp_data["type_selectiontype"] = tmp_data["container_type"];
    // delete tmp_data["container_type"];
    // 
    let custom_fields = [
      "container_title",
      "container_grade_title",
      "type",
      "type_selectiontype",
      "location",
      "store_id",
      "length_width",
      "height",
      "grade",
      "condition",
      "selectionoptions",
      "doortype",
      "sales_tags",
      "payment_type",
      "payment_term",
      "reefer_container",
      "reefer_container_status",
    ];

    let formattedData = {
      title: tmp_data["title"],
      categories: tmp_data["categories"],
      price: tmp_data["price"],
      stocks: tmp_data["stocks"],
      custom_fields: {}
    }

    if (update) {
      formattedData["id"] = update["id"];
    }
    data_keys = Object.keys(tmp_data);
    // console.log("to cf_keys", data_keys);
    data_keys.forEach((v, i) => {
      if (custom_fields.includes(v)) {
        tmp_custom_fields[v] = tmp_data[v];
      }
    })
    formattedData["custom_fields"] = tmp_custom_fields;
    // console.log("formattedData to be sent: ", formattedData)
    return formattedData;
  }

  //============================================================================
  //============================================================================
  //============================================================================
  //============================================================================
  const tabs = [
    { name: "location", label: "Location" },
    { name: "category", label: "Category" },
    { name: "specs", label: "Specifications" },
    { name: "pricing_terms", label: "Pricing & Terms" },
    { name: "inventory", label: "Inventory" },
    { name: "other", label: "Other" },
  ];
  const payment_terms_options = [
    { value: "buy", label: "Buy" },
    { value: "rental-12", label: "Rental 12months+" },
    { value: "rental-6", label: "Rental 6months+" },
    { value: "rental-3", label: "Rental 3months+" },
    { value: "rto-48", label: "Rent-To-Own 48months" },
    { value: "rto-36", label: "Rent-To-Own 36months" },
    { value: "rto-24", label: "Rent-To-Own 24months" },
    { value: "rto-12", label: "Rent-To-Own 12months" },
  ];

  const size_options = [
    { value: "10'", label: "10-foot" },
    { value: "20'", label: "20-foot" },
    { value: "40'", label: "40-foot" },
    { value: "45'", label: "45-foot" },
    { value: "53'", label: "53-foot" },
  ];

  const height_options = [
    { value: "standard", label: "8' 6\" Standard" },
    { value: "highcube", label: "9' 6\" High Cube (HC)" },
  ];

  const grade_options = [
    { value: "AS IS", label: "AS IS" },
    { value: "Cargo Worthy (CW)", label: "Cargo Worthy (CW)" },
    { value: "IICL", label: "IICL" },
    { value: "Wind and Water tight (WWT)", label: "Wind and Water Tight (WWT)" },
  ];

  const condition_options = [
    { value: "Used", label: "Used" },
    { value: "New", label: "New" },
    { value: "Refurbished", label: "Refurbished" },
  ];


  const door_type_options = [
    { value: "Double Doors at 1 End", label: "Double Doors at 1 End" },
  ];

  const sales_tag_options = [
    { value: "", label: "None" },
    { value: "bestseller", label: "BestSeller" },
    { value: "top choice", label: "Top Choice" },
  ];

  const reefer_options = [
    { value: "1", label: "Yes" },
    { value: "0", label: "No" },
  ];

  const reefer_status_options = [
    { value: "1", label: "Yes" },
    { value: "0", label: "No" },
  ];
  const form_start_tab = "location";
  const form_last_tab = "other";

  const [tab, setTab] = useState("location");
  const [selectedDepotDetails, setSelectedDepotDetails] = useState(null);

  const isValidJSON = (json_var) => {
    try {
      JSON.parse(json_var);
      return true;
    } catch (e) {
      return false;
    }
  }

  // Handle primary tab click
  const handlePrimaryTabClick = (tab) => {
    setActivePrimaryTab(tab);
    setTab('location'); // Reset secondary tab when switching primary tabs
  };


  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFormNavController = (direction) => {
    // direction prev or next
    setTab(prev => {
      const index = tabs.findIndex(i => i.name === prev);
      if (direction === "prev") {
        return tabs[index - 1].name;
      } else {
        return tabs[index + 1].name;
      }
    })
  }

  const handleDepotOnChange = (e) => {
    const { value } = e.target;
    const location_title = locations.filter(i => i.id === value)[0]?.title;
    if (location_title) {
      const filter_location = locations.filter(i => parseInt(i.id) === parseInt(value));
      if (filter_location.length > 0) {
        let details = filter_location[0];
        if (isValidJSON(details["custom"])) {
          details["custom"] = JSON.parse(details["custom"]);
        } else {
          details["custom"] = details["custom"];
        }
        setSelectedDepotDetails(details);
        setFormData(prev => ({ ...prev, store_id: value, location: location_title }));
      }
    }
  }


  useEffect(() => {
    console.log("formDataOnChange", formData)
  }, [formData]);

  const handleFormRadioChange = ({ prop, val }) => {
    setFormData(prev => ({ ...prev, [prop]: val }));
  }

  const handleTermClick = (term) => {
    setFormData(prev => ({ ...prev, payment_type: term }));
  }

  const handlePriceInput = (e) => {
    const { value } = e.target;
    // Allow only numeric input and empty string
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setFormData(prev => ({ ...prev, price: value }));
    }
  }

  const handleStocksInput = (e) => {
    const { value } = e.target;
    // Allow only numeric input and empty string
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setFormData(prev => ({ ...prev, stocks: value }));
    }
  }

  const handleContainerGradeTitle = (e) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, container_grade_title: value }));
  }

  const handleContainerType = (e) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, container_type: value }));
  }


  const handleCategoryClick = (category_id) => {
    setFormData(prev => {
      const prev_category = prev["categories"];
      if (prev_category.includes(parseInt(category_id))) {
        let filtered = prev_category.filter(i => parseInt(i) !== parseInt(category_id));
        if (filtered.length === 0) {
          return { ...prev, categories: [lockedCategory] };
        } else {
          let cat = [...new Set([...filtered, lockedCategory])];
          return { ...prev, categories: cat };
        }
      } else {
        let cat = [...prev_category, parseInt(category_id)];
        cat = [...new Set([...cat, lockedCategory])];
        return { ...prev, categories: cat };
      }
    });
  }

  //============================================================================
  //============================================================================
  //============================================================================
  //============================================================================
  return (
    <div className="">
      <div className="w-full flex justify-between item-center">
        {/* Primary Tab Buttons */}
        <div className="w-[calc(100%-100px)] flex border-b">
          {primaryTabs.map((ptab) => (
            <button
              key={ptab.name}
              ref={ptab.ref}
              className={`product-form-primary-tab ${activePrimaryTab === ptab.name ? 'active' : ''
                }`}
              onClick={() => handlePrimaryTabClick(ptab.name)}
            >
              {ptab.name}
            </button>
          ))}
        </div>
        {/* <div className="w-[100px] flex item-center justify-end pt-[10px] pr-[10px] border-b">
          <Icon icon="mingcute:close-fill" />
        </div> */}
      </div>
      {/* modal content */}
      {
        activePrimaryTab === "Shipping Container" && (<>
          {/* primary tab heading */}
          <div className="flex justify-between p-4 border-b">
            <div className="pr-[50px]">
              {
                update ? (
                  <div>
                    <div className="font-semibold">
                      {formData?.title}
                    </div>
                    <div>SKU: {formData?.sku}</div>
                  </div>
                ) : (
                  <div className="text-[0.9em]">
                    <div className="font-bold">Title (Auto-generate)</div>
                    <div className="font-bold">SKU (Auto-generate)</div>
                    {/* <div className="font-bold">Category: Shipping Container</div> */}
                  </div>
                )

              }
            </div>
          </div>
          <div className="flex w-full p-0 min-h-[400px]">
            <div className="w-[180px] cursor-pointer flex flex-col bg-stone-200">
              {
                tabs.map((i, index) => (
                  <div onClick={() => setTab(i.name)} key={`tab-${i.name}`} className={`flex-1 flex items-center px-4 py-[15px] border-white ${index < (tabs.length - 1) ? "border-b" : ``}  ${tab === i.name ? "bg-white" : "border-r"}`}>
                    <div className={`${tab === i.name ? "font-bold" : "text-stone-400"}`}>{i.label}</div>
                  </div>
                ))
              }
            </div>
            <div className="w-full p-4">
              <div>
                <div>
                  {activePrimaryTab === 'Shipping Container' && (
                    <div>

                      {/* Secondary Tab Content with Form Elements */}
                      <div className="mt-4">
                        {
                          tab === "location" &&
                          <div className="w-full">
                            <label className="block mb-2">Select Location</label>
                            <select multiple={false} name="depots" id="depots" value={formData?.store_id} onChange={handleDepotOnChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                              {
                                locations && locations.length > 0 && locations.map((v, i) =>
                                  <option key={`depot-${v.id}`} value={v.id}>
                                    {`${v?.title} ${v?.country == 223 ? "(US)" : "(CA)"}`}
                                  </option>
                                )
                              }
                            </select>
                            {
                              selectedDepotDetails && <div className="w-full flex flex-col gap-4 mt-4">
                                <div>DepotID: {selectedDepotDetails?.id}</div>
                                <div>Country: {selectedDepotDetails?.country == 223 ? "United States" : "Canada"}</div>
                                <div>Relocation Fee: ${selectedDepotDetails?.custom?.relocation_fee}</div>
                                <div>Is Virtual Depot: {selectedDepotDetails?.custom?.is_virtual_depo}</div>
                              </div>
                            }
                          </div>
                        }
                        {
                          tab === "specs" &&
                          <div className="w-full flex flex-col gap-2">
                            <FormRadio label={`Size`} property={"length_width"} options={size_options} value={formData?.length_width} defaultValue={"20'"} onSelectionChange={handleFormRadioChange} />
                            <FormRadio label={`Height`} property={"form_height"} options={height_options} value={formData?.form_height} defaultValue={"standard"} onSelectionChange={handleFormRadioChange} />
                            <FormRadio label={`Grade`} property={"grade"} options={grade_options} value={formData?.grade} defaultValue={"Wind and Water tight (WWT)"} onSelectionChange={handleFormRadioChange} />
                            <FormRadio label={`Condition`} property={"condition"} options={condition_options} value={formData?.condition} defaultValue={"Used"} onSelectionChange={handleFormRadioChange} />
                            <FormRadio label={`Selection Type`} property={"form_selectionoptions"} options={selection_type_options} value={formData?.form_selectionoptions} defaultValue={"FO"} onSelectionChange={handleFormRadioChange} />
                            <FormRadio label={`Door Type`} property={"doortype"} options={door_type_options} value={formData?.doortype} defaultValue={"Double Doors at 1 End"} onSelectionChange={handleFormRadioChange} />
                          </div>
                        }
                        {
                          tab === "pricing_terms" &&
                          <div className="w-full flex flex-col h-full gap-1">
                            {
                              payment_terms_options.map((v, i) =>
                                <div key={`terms-${i}`} className={`cursor-pointer flex-1 user-select-none flex items-center border rounded ${formData?.payment_type === v.value ? "bg-green-500 border-green-800" : "bg-white hover:border-stone-400"}`} onClick={() => handleTermClick(v.value)}>
                                  <div className="px-2 use-select-none">
                                    <Icon icon="lets-icons:check-fill" className={`${formData?.payment_type === v.value ? "text-white" : "text-stone-300"}`} />
                                  </div>
                                  <div className={`${formData?.payment_type === v.value ? "text-white" : "text-stone-500"}`}>{v.label}</div>
                                </div>
                              )
                            }
                            {
                              <div className="pt-2">
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
                                <input type="number" value={formData?.price} onChange={handlePriceInput} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                              </div>
                            }
                          </div>
                        }
                        {
                          tab === "other" &&
                          <div className="w-full flex flex-col gap-4">
                            <div className="">
                              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Container Grade Title</label>
                              <input value={formData?.container_grade_title} onChange={handleContainerGradeTitle} type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                            </div>
                            <div className="">
                              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Container Type</label>
                              <input value={formData?.container_type} onChange={handleContainerType} type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                            </div>
                            <FormRadio label={`Sales Tag`} property={"sales_tags"} options={sales_tag_options} value={formData?.sales_tags} defaultValue={""} onSelectionChange={handleFormRadioChange} />
                            <FormRadio label={`Reefer Container`} property={"reefer_container"} options={reefer_options} value={formData?.reefer_container} defaultValue={"1"} onSelectionChange={handleFormRadioChange} />
                            <FormRadio label={`Reefer Container Status`} property={"reefer_container_status"} options={reefer_status_options} value={formData?.reefer_container_status} defaultValue={"1"} onSelectionChange={handleFormRadioChange} />
                          </div>
                        }
                        {
                          tab === "category" &&
                          <div className="w-full flex flex-col h-full gap-1">
                            {
                              categories && containerCategories && categories.length > 0 && containerCategories.map((v, i) =>
                                <div key={`cat-${i}`} data-id={v.id} data-slug={v.slug} className={`cursor-pointer flex-1 user-select-none flex items-center border rounded ${formData?.categories.includes(v.id) ? "bg-green-500 border-green-800" : "bg-white hover:border-stone-400"}`} onClick={() => handleCategoryClick(v.id)}>
                                  <div className="px-2 use-select-none">
                                    <Icon icon="lets-icons:check-fill" className={`${formData?.categories.includes(v.id) ? "text-white" : "text-stone-300"}`} />
                                  </div>
                                  <div className={`${formData?.categories.includes(v.id) ? "text-white" : "text-stone-500"}`}>{`${v?.parent!==0? containerCategories.filter(i=>i.id === v?.parent)[0]?.name + " > " + v?.name :v?.name}`}</div>
                                </div>
                              )
                            }
                          </div>
                        }
                        {
                          tab === "inventory" &&
                          <div className="w-full flex flex-col gap-4">
                              <div className="">
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Stocks</label>
                                <input type="number" value={formData?.stocks} onChange={handleStocksInput} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                              </div>
                          </div>
                        }
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>

          </div>
          <div className="p-4 border-t">
            <div className="w-full flex justify-between items-center">
              <div>
                <button onClick={() => handleFormNavController("prev")} className={`react-secondary-button mr-4 ${tab !== form_start_tab ? "" : "disabled"}`}>Previous</button>
                <button onClick={() => handleFormNavController("next")} className={`react-secondary-button ${tab !== form_last_tab ? "" : "disabled"}`}>Next</button>
              </div>
              <div>
                <button className={`react-primary-button ${tab === form_last_tab ? disableSubmit ? "disabled" : "" : "disabled"}`} onClick={handleSubmit} disabled={disableSubmit}>
                  {
                    disableSubmit ? "Processing..." : "Submit"
                  }
                </button>
              </div>
            </div>
          </div></>)
      }
      {activePrimaryTab === 'Accessory' && (
        <div className="p-4">
          {/* <h2 className="text-xl font-bold mb-2">Accessory Content</h2>
          <p>This section contains information about accessories.</p> */}
          <AccessoryForm update={update} categories={categories} onUpdate={onUpdate} onAddProduct={onAddProduct}/>
        </div>
      )}
      {activePrimaryTab === 'Modification' && (
        <div className="p-4">
          <h2 className="text-xl font-bold mb-2">Modification Content</h2>
          <p>This section contains information about modifications.</p>
        </div>
      )}
    </div>
  );
};

export default ProductsDetailsForm;
