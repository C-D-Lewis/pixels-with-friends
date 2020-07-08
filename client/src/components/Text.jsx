import React from 'react';

/**
 * Text component.
 *
 * @param {Object} props - Component props.
 * @returns {HTMLElement}
 */
const Text = ({ children }) => (
  <div
    style={{
      fontSize: '1.1rem',
      color: 'white',
      margin: '15px 0px',
      cursor: 'default',
    }}>
    {children}
  </div>
);

export default Text;
