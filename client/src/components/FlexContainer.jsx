import React from 'react';

/**
 * FlexComponent component.
 *
 * @param {Object} props - Component props.
 * @returns {HTMLElement}
 */
const FlexComponent = ({ children, className, onClick, style }) => (
  <div
    className={className}
    onClick={onClick}
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      ...style,
    }}>
    {children}
  </div>
);

export default FlexComponent;
