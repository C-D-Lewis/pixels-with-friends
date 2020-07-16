import React from 'react';
import Text from './Text.jsx';

/**
 * Subtitle component.
 *
 * @param {Object} props - Component props.
 * @returns {HTMLElement}
 */
const Subtitle = ({ children, style }) => (
  <Text
    style={{
      fontSize: '1.3rem',
      margin: '0px auto 10px auto',
      textDecoration: 'underline',
      color: 'black',
      ...style,
    }}>
    {children}
  </Text>
);

export default Subtitle;
