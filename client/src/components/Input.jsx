import React from 'react';

/**
 * Input component.
 *
 * @param {Object} props - Component props.
 * @returns {HTMLElement}
 */
const Input = ({ placeholder, onChange }) => (
  <input
    type="text"
    style={{
      fontSize: '1.2rem',
      color: 'black',
      backgroundColor: '#fff',
      margin: '10px 0px',
      padding: '5px 5px',
      textAlign: 'center',
      outline: 'none',
      border: '1px solid #444',
      borderRadius: 5,
    }}
    placeholder={placeholder}
    onChange={el => onChange(el.target.value)}/>
);

export default Input;
