import React from 'react';

/**
 * Button component.
 *
 * @param {Object} props - Component props.
 * @returns {HTMLElement}
 */
const Button = ({ children, onClick, style }) => (
  <div
    className="button"
    style={{
      fontSize: '1.2rem',
      color: 'white',
      backgroundColor: '#000',
      margin: '5px 0px',
      padding: '10px 15px',
      textAlign: 'center',
      border: '1px solid #444',
      borderRadius: 5,
      cursor: 'pointer',
      ...style,
    }}
    onClick={onClick}>
    {children}
  </div>
);

export default Button;
