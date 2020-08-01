import React from 'react';

/**
 * Pill component.
 *
 * @param {Object} props - Component props.
 * @returns {HTMLElement}
 */
const Pill = ({ children, backgroundColor, onClick }) => (
  <div
    onClick={() => onClick ? onClick() : null}
    style={{
      backgroundColor,
      color: 'white',
      padding: '3px 8px',
      marginLeft: 10,
      borderRadius: 50,
      cursor: onClick ? 'pointer' : 'default',
    }}>
    {children}
  </div>
);

export default Pill;
