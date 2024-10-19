// DropdownField.jsx
import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";

const DropdownField = ({
  label,
  type,
  name,
  value,
  onChange,
  placeholder,
  selection,
  required,
}) => {

  const [dropdownValue, setDropdownValue] = useState(value);
  const [dropdownOptions, setDropdownOptions] = useState(selection);


  useEffect(()=>{
    // console.log("dropdownValue", dropdownValue);
  },[dropdownValue])


  useEffect(()=>{
    // setDropdownValue(transformHeightString(value))
    setDropdownValue(value)
  },[value])
  
  useEffect(()=>{
    // setDropdownOptions(selection.map(i=> ({...i, id: transformHeightString(i.id)})))
    setDropdownOptions(selection)
  },[selection])

  const transformHeightString = (input) => {
    return input.replace(/"/g, '\\"'); // Replace double quotes with escaped double quotes
  };

  return (
    <div className="dropdown-field">
      {label && (
        <label htmlFor={name} className="w-full font-semibold text-sm">
          {label}
        </label>
      )}
      <select
        type={type}
        name={name}
        id={name}
        value={dropdownValue}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full border border-slate-400 p-1 text-sm hover:border-indigo-300 outline-indigo-300">
        {dropdownOptions.map((option, index) => (
          <option key={option.id} value={transformHeightString(option?.id)}>
            {option?.label}
          </option>
        ))}
      </select>
    </div>
  );
};

DropdownField.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  selection: PropTypes.array,
  required: PropTypes.bool,
};

// DropdownField.defaultProps = {
//   label: "",
//   value: "",
//   selection: [],
//   placeholder: "",
//   required: false,
// };

export default DropdownField;
