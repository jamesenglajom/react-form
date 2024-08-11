// InputField.jsx
import React from "react";
import PropTypes from "prop-types";

const InputField = ({
  label,
  type,
  name,
  value,
  onChange,
  placeholder,
  twClass,
  required,
}) => {
  return (
    <div className="input-field">
      {label && (
        <label htmlFor={name} className="w-full font-semibold text-sm">
          {label}
        </label>
      )}
      <input
        type={type}
        name={name}
        id={name}
        value={value??""}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`${twClass} w-full border border-slate-400 p-1 text-sm hover:border-indigo-300 outline-indigo-300`}
      />
    </div>
  );
};

InputField.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  // value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  twClass: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
};


export default InputField;
