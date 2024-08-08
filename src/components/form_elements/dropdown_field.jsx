// DropdownField.jsx
import React from "react";
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
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full border border-slate-400 p-1 text-sm hover:border-indigo-300 outline-indigo-300">
        {selection.map((option, index) => (
          <option key={name + "_" + option.id + "_" + index} value={option?.id}>
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
