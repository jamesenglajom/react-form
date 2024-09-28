import React, { useState, useEffect } from "react";
import InputField from "../form_elements/input_field";
import DropdownField from "../form_elements/dropdown_field";
import CheckboxField from "../form_elements/checkbox_field";
import ToggleField from "../form_elements/toggle_field";
import CategoryField from "../form_elements/category_field";
import { form_object, form_fields } from "../../static/product_details_form";
import axios from "axios";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const ProductsDetailsForm = ({locations, update, onUpdate, onAddProduct}) => {
  const MySwal = withReactContent(Swal)

  let default_form_values = form_fields.reduce(
    (acc, field) => ({ ...acc, [field.property_name]: field.value ?? "" }),
    {}
  );

  useEffect(()=>{
    if(!update){
      setFormData({
        ...formData,
        ["location"]: locations[0]["title"],
      });
    }
  },[locations]);
  const [requestError,setRequestError] = useState({});
  const populateData = (data) => {
    let form_payment_type = "buy";
    if(data["cf_payment_type"] !== "buy"){
      form_payment_type = `${data["cf_payment_type"]}-${data["cf_payment_term"][0]}`; 
      console.log(form_payment_type);
    }

    return {
      title: data["name"]??"",
      price: data["price"]??0,
      categories: data["categories"]??[],
      condition: data["cf_condition"]??"",
      container_grade_title: data["cf_container_grade_title"]??"",
      container_title: data["cf_container_title"]??"",
      container_type: data["cf_type_selectiontype"] ?? "",
      doortype:  data["cf_doortype"] ?? "",
      grade: data["cf_grade"]??"Wind and Water tight (WWT)",
      height: data["cf_height"] ?? "10'",
      length_width:  data["cf_length_width"] ?? `8' 6" Starndard`,
      location: data["cf_location"] ?? "Atlanta, GA",
      payment_type: form_payment_type,
      reefer_container: data["cf_reefer_container"] === "1",
      reefer_container_status: data["cf_reefer_container_status"] === "1",
      sales_tags: data["cf_sales_tags"] ? data["cf_sales_tags"].toLowerCase():"",
      selectionoptions: data["cf_selectionoptions"] ?? "First off the Stack (FO)",
      sku: data["sku"]??"",
    }
  }

  // console.log("default_form_values",default_form_values);
  if(update){
    try{
      default_form_values = populateData(update)
    }catch(err){
      console.log("err data", err)
    }
  }
  const [formData, setFormData] = useState(default_form_values);
  // insert location options
  form_object[2]["elements"][0]["selection"] = locations.map(i=> ({id:i.title, label: i.title}));

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const property_value = type === "checkbox" ? checked : value;
    
    setFormData((prev) => {
      return {
      ...prev,
      [name]: property_value,
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("Form submitted:", formData);
    console.log("formatted data: ", formatData(formData));
    // Handle form submission
    // createUpdateProduct(formatData(formData));
  };

  const permalinkSlug = (title) => {
    return "https://onsitestorage.com/product/" + title
      .toLowerCase() // Convert to lowercase
      .replace(/\s+/g, '-') // Replace one or more spaces with a dash
      .replace(/[^\w-]+/g, '') // Remove non-alphanumeric characters and underscores
      .replace(/^-+/, '') // Remove leading dashes
      .replace(/-+$/, ''); // Remove trailing dashes
  }

  useEffect(()=>{
    handleResponseError();
  },[requestError]);

  const handleResponseError = () => {
    console.log("REQUEST ERROR:",requestError);
    if(requestError.code == 400){
      if(requestError.message === "DUPLICATE_SKU"){
        let dupli_html = "";
        requestError.data.duplicates.forEach((v,i)=>{
          console.log("dupli", v);
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
          html:`
          <div class="w-full text-left">Duplicate Items</div>
          ${dupli_html}
          `
        })
      }
    }
  }

  const createUpdateProduct = async (data) => {
    let API_URL = "https://onsitestorage.com/wp-json/wp_to_react/v1/product";
    if(data["id"]){
      API_URL = API_URL + "/" + data["id"];
    }
    try {
      const response = await axios.post(API_URL, data, {
        headers: {
          'Content-Type': 'application/json',
        }
      }).then((response) => {
        // Handle the response
        console.log("update details response:", response.data);
        if (update) {
          let populated_data = populateData(response.data.product);
          setFormData(populated_data);
          onUpdate(response.data.product);
        }else{
          setFormData(default_form_values);
          onAddProduct();
        }
      }).catch((error) => {
        // Handle the error
        // console.error("update details error:", error);
        if(error.response.data.code == 400){
          setRequestError(error.response.data);
        }
      });
      // console.log("Successfully Created");
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const formatData = (data) => {
    let tmp_custom_fields = {};
    let data_keys = [];
    // set default value for property
    data["is_product_rent-to-own"] = false;
    data["store_id"] = 121; // vna
    // handle permalink value base on container_title
    if(data["container_title"]){
      data["permalink"] = permalinkSlug(data["container_title"]);
    }
    // handle store id
    if(data["location"]){
      data["store_id"] = locations.filter(i=> i.title === data["location"])[0].id;
    }
    // handle container type
    data["type"] = data["container_type"];
    data["type_selectiontype"] = data["container_type"];
    // delete data["container_type"];
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
      title: data["title"],
      categories: data["categories"],
      price: data["price"],
      custom_fields: {}
    }

    if(update){
      formattedData["id"] = update["id"];
    }
    data_keys = Object.keys(data);
    // console.log("to cf_keys", data_keys);
    data_keys.forEach((v, i) => {
      if (custom_fields.includes(v)) {
        tmp_custom_fields[v] = data[v];
      }
    })
    formattedData["custom_fields"] = tmp_custom_fields;
    return formattedData;
  }


  return (
    <div className="p-5">
      <div>
        <div className="border-b-[2px] border-stone-500 p-2 font-bold">
          Product Form
        </div>
        <div className="border-stone-400 pb-3">
          <form onSubmit={handleSubmit}>
            {form_object.map((group, index) => (
              // display if type input
              <div
                key={`form-group-${index}`}
                className={` w-full px-2 py-4 pb-[30px] border-b border-stone-300`}>
                <div className={`${""} text-lg uppercase font-bold`}>
                  {group.name}
                </div>
                <div
                  className={`${group.group_style} border-l-[12px] border-indigo-300 pl-2`}>
                  {group.elements.map((input_el, index1) => (
                    <div
                      key={`form-group-${input_el.property_name}-${index}`}
                      className={`${input_el?.style} py-2`}>
                      {[
                        "text",
                        "email",
                        "url",
                        "number",
                        "date",
                        "time",
                        "datetime-local",
                        "month",
                        "week",
                      ].includes(input_el.type) && (
                          <InputField
                            label={input_el.label}
                            type={input_el.type}
                            name={input_el.property_name}
                            value={formData[input_el.property_name]}
                            onChange={handleChange}
                          />
                        )}
                      {/* dropdown */}
                      {["dropdown"].includes(input_el.type) && (
                        <DropdownField
                          label={input_el.label}
                          type={input_el.type}
                          name={input_el.property_name}
                          value={formData[input_el.property_name]}
                          onChange={handleChange}
                          selection={input_el.selection}

                        />
                      )}
                      {/* checkbox */}
                      {["checkbox"].includes(input_el.type) && (
                        <CheckboxField
                          label={input_el.label}
                          type={input_el.type}
                          name={input_el.property_name}
                          checked={formData[input_el.property_name]}
                          onChange={handleChange}
                          selection={input_el.selection}

                        />
                      )}
                      {/* toggle */}
                      {["toggle"].includes(input_el.type) && (
                        <ToggleField
                          label={input_el.label}
                          type={input_el.type}
                          name={input_el.property_name}
                          checked={formData[input_el.property_name]}
                          onChange={handleChange}
                          selection={input_el.selection}

                        />
                      )}
                      {/* product category */}
                      {["product_category"].includes(input_el.type) && (
                        <CategoryField
                          label={input_el.label}
                          name={input_el.property_name}
                          value={formData[input_el.property_name]}
                          onChange={handleChange}
                          // type={input_el.type}
                          // checked={formData[input_el.property_name]}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <button
              type="submit"
              className="mt-5 ml-3 px-3 py-1 upper bg-red-500">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductsDetailsForm;
