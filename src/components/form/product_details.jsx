import React, { useState, useEffect } from "react";
import InputField from "../form_elements/input_field";
import DropdownField from "../form_elements/dropdown_field";
import CheckboxField from "../form_elements/checkbox_field";
import ToggleField from "../form_elements/toggle_field";
import { form_object, form_fields } from "../../static/product_details_form";
import axios from "axios";

const ProductsDetailsForm = ({locations, update}) => {
  let default_form_values = form_fields.reduce(
    (acc, field) => ({ ...acc, [field.property_name]: field.value ?? "" }),
    {}
  );
  console.log("default_form_values",default_form_values);
  if(update){
    console.log("update: ", update)
    try{
      default_form_values = {
        condition: update["cf_condition"][0],
        container_grade_title: update["cf_container_grade_title"][0],
        container_title: update["cf_container_title"][0],
        container_type: update["cf_type_selectiontype"]?.[0] ?? "",
        doortype:  update["cf_doortype"][0],
        grade: update["cf_grade"][0],
        height: update["cf_height"][0],
        length_width:  update["cf_length_width"][0],
        location: update["cf_location"][0],
        payment_type: update["cf_payment_type"][0],
        reefer_container: update["cf_reefer_container"][0] === "1",
        reefer_container_status: update["cf_reefer_container_status"][0] === "1",
        sales_tags: update["cf_sales_tags"]?.[0] ? update["cf_sales_tags"][0].toLowerCase():"",
        selectionoptions: update["cf_selectionoptions"][0],
        sku: update["sku"],
      }
    }catch(err){
      console.log("err data", err)
    }
  }
  const [formData, setFormData] = useState(default_form_values);
  form_object[1]["elements"][0]["selection"] = locations.map(i=> ({id:i.title, label: i.title}));
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("Form submitted:", formData);
    console.log("formatted data: ", formatData(formData));
    // Handle form submission
    createUpdateProduct(formatData(formData));
  };

  const permalinkSlug = (title) => {
    return "https://onsitestorage.com/product/" + title
      .toLowerCase() // Convert to lowercase
      .replace(/\s+/g, '-') // Replace one or more spaces with a dash
      .replace(/[^\w-]+/g, '') // Remove non-alphanumeric characters and underscores
      .replace(/^-+/, '') // Remove leading dashes
      .replace(/-+$/, ''); // Remove trailing dashes
  }
  const createUpdateProduct = async (data) => {
    let API_URL = "https://onsitestorage.com/wp-json/wp_to_react/v1/product";
    if(data["id"]){
      console.log("id", data["id"]);
      API_URL = API_URL + "/" + data["id"];
    }
    try {
      console.log("create/update product(data): ", data)
      const response = await axios.post(API_URL, data, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log("create response: ", response);
      setFormData(default_form_values);
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
    data["payment_term"] = "";
    data["store_id"] = 121; // vna
    // handle payment term
    if (data["payment_type"] !== "buy") {
      let ptype = data["payment_type"].split("-")[0];
      let pterm = data["payment_type"].split("-")[1];
      data["payment_type"] = ptype;
      data["payment_term"] = [parseInt(pterm)];
      if (ptype === "rto") {
        data["is_product_rent-to-own"] = true;
      }
    }
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
      "sales_tag",
      "payment_type",
      "payment_term",
      "reefer_container",
      "reefer_container_status",
    ]
    let formattedData = {
      title: data["container_title"],
      sku: data["sku"],
      custom_fields: {}
    }

    if(update){
      formattedData["id"] = update["id"];
    }
    data_keys = Object.keys(data);
    console.log("to cf_keys", data_keys);
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
          Product Details Form
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
