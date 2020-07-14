import React from 'react';

/**
 * Input component.
 *
 * @param {Object} props - Component props.
 * @returns {HTMLElement}
 */
const Input = ({ placeholder, value, onChange }) => (
  <input
    type="text"
    value={value}
    style={{
      minWidth: 250,
      fontSize: '1.1rem',
      color: 'black',
      backgroundColor: '#0001',
      margin: '10px 0px',
      padding: '7px',
      textAlign: 'center',
      outline: 'none',
      border: 'none',
      borderRadius: 5,
    }}
    placeholder={placeholder}
    onChange={el => onChange(el.target.value)}/>
);

export default Input;
