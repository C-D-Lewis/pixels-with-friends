import React from 'react';
import { PlayerColors } from '../constants';

/**
 * Button component.
 *
 * @param {Object} props - Component props.
 * @returns {HTMLElement}
 */
const Button = ({ children, disabled = false, onClick, style }) => (
  <div
    className="button"
    style={{
      fontSize: '1.2rem',
      color: '#ddd',
      backgroundColor: !disabled ? PlayerColors.find(p => p.name === 'green').dark : '#ccc',
      margin: '10px 0px',
      padding: '10px 15px',
      textAlign: 'center',
      borderRadius: 5,
      cursor: 'pointer',
      ...style,
    }}
    onClick={onClick}>
    {children}
  </div>
);

export default Button;
