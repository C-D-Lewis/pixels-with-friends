import React from 'react';
import Text from './Text.jsx';

/**
 * Subtitle component.
 *
 * @param {Object} props - Component props.
 * @returns {HTMLElement}
 */
const Subtitle = ({ children }) => (
  <Text
    style={{
      fontSize: '1.3rem',
      marginTop: 25,
      marginLeft: 'auto',
      marginRight: 'auto',
      textDecoration: 'underline',
    }}>
    {children}
  </Text>
);

export default Subtitle;
