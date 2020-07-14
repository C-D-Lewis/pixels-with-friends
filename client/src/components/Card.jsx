import React from 'react';
import FlexContainer from './FlexContainer.jsx';

/**
 * Card component.
 *
 * @param {Object} props - Component props.
 * @returns {HTMLElement}
 */
const Card = ({ children }) => (
  <FlexContainer
    style={{
      backgroundColor: 'white',
      borderRadius: 5,
      boxShadow: '2px 2px 3px 2px #4443',
      padding: 15,
      marginTop: 20,
    }}>
    {children}
  </FlexContainer>
);

export default Card;
