import React from 'react';

/**
 * Title component.
 *
 * @param {Object} props - Component props.
 * @returns {HTMLElement}
 */
const Title = ({ children }) => (
  <div
    style={{
      fontSize: '2rem',
      color: 'white',
      cursor: 'default',
    }}>
    {children}
  </div>
);

export default Title;
