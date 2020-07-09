import React from 'react';

/**
 * Text component.
 *
 * @param {Object} props - Component props.
 * @returns {HTMLElement}
 */
const Text = ({ children, style }) => (
  <div
    style={{
      fontSize: '1.1rem',
      color: 'white',
      margin: '15px 0px',
      cursor: 'default',
      ...style,
    }}>
    {children}
  </div>
);

export default Text;
