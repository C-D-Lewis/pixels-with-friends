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
      margin: '25px 10px 0px 0px',
      cursor: 'default',
    }}>
    {children}
  </div>
);

export default Title;
