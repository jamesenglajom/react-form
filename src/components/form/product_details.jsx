import React, { useState } from "react";
import InputField from "../form_elements/input_field";
import DropdownField from "../form_elements/dropdown_field";
import CheckboxField from "../form_elements/checkbox_field";
import ToggleField from "../form_elements/toggle_field";
import { form_object, form_fields } from "../../static/product_details_form";

const ProductsDetailsForm = () => {
  const [formData, setFormData] = useState(
    form_fields.reduce(
      (acc, field) => ({ ...acc, [field.property_name]: field.value ?? "" }),
      {}
    )
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type == "checkbox" ? checked : value,
    });
    console.log(formData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission
  };

  return (
    <div className="p-5">
      <div>
        <div className="border border-slate-500 p-2 font-bold">
          Product Details Form
        </div>
        <div className="border border-slate-400 pb-3">
          <form onSubmit={handleSubmit}>
            {form_object.map((group, index) => (
              // display if type input
              <div
                key={`form-group-${index}`}
                className={` w-full px-2 py-4 pb-[30px] border-b border-slate-300`}>
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
                          // placeholder="Enter your username"
                          // required
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
                          // placeholder="Enter your username"
                          // required
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
                          // placeholder="Enter your username"
                          // required
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
                          // placeholder="Enter your username"
                          // required
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
