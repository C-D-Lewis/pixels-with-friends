import React from 'react';
import Text from './Text.jsx';

/**
 * Subtitle component.
 *
 * @param {Object} props - Component props.
 * @returns {HTMLElement}
 */
const Subtitle = ({ children, color = 'black', style }) => (
  <Text
    style={{
      fontSize: '1.3rem',
      margin: '25px auto 5px auto',
      color,
      ...style,
    }}>
    {children}
  </Text>
);

export default Subtitle;
