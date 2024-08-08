// CheckboxField.jsx
import React from "react";
import PropTypes from "prop-types";

const CheckboxField = ({
  label,
  type,
  name,
  checked,
  onChange,
  placeholder,
  required,
}) => {
  return (
    <div className="checkbox-field">
      {label && (
        <label htmlFor={name} className="w-full font-semibold text-sm">
          <input
            type={type}
            name={name}
            id={name}
            checked={checked}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className="border border-slate-400 p-1 mr-2 text-sm hover:border-indigo-300 outline-indigo-300"
          />
          {label}
        </label>
      )}
    </div>
  );
};

CheckboxField.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
};

// CheckboxField.defaultProps = {
//   label: "",
//   placeholder: "",
//   required: false,
// };

export default CheckboxField;
