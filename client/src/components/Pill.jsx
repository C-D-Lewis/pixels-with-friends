import React from 'react';

/**
 * Pill component.
 *
 * @param {Object} props - Component props.
 * @returns {HTMLElement}
 */
const Pill = ({ children, backgroundColor }) => (
  <div
    style={{
      backgroundColor,
      color: 'white',
      padding: '3px 8px',
      marginLeft: 10,
      borderRadius: 50,
    }}>
    {children}
  </div>
);

export default Pill;
