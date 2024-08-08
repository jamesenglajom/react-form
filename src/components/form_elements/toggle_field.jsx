// ToggleField.jsx
import React from "react";
import PropTypes from "prop-types";

const ToggleField = ({
  label,
  type,
  name,
  value,
  onChange,
  placeholder,
  required,
}) => {
  return (
    <div className="toggle-field">
      {label && (
        <label htmlFor={name} className="w-full font-semibold text-sm">
          {label}
        </label>
      )}
      <div className="mt-2">
        <input
          type="checkbox"
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="border border-slate-400 p-1 text-sm hover:border-indigo-300 outline-indigo-300"
        />
      </div>
    </div>
  );
};

ToggleField.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
};

// ToggleField.defaultProps = {
//   label: "",
//   placeholder: "",
//   required: false,
// };

export default ToggleField;
