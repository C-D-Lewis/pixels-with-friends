import React from 'react';
import FlexContainer from './FlexContainer.jsx';
import Text from './Text.jsx';

/**
 * Footer component.
 *
 * @param {Object} props - Component props.
 * @returns {HTMLElement}
 */
const Footer = () => (
  <FlexContainer
    style={{
      paddingBottom: 10,
      height: '100%',
      justifyContent: 'flex-end',
    }}>
    <Text
      style={{
        fontSize: '0.8rem',
        margin: '5px 0px',
      }}>
      Created by Chris Lewis
    </Text>
    <Text
      style={{
        fontSize: '0.8rem',
        margin: '5px 0px',
      }}>
      Source available on <a target="_blank" href="https://github.com/c-d-lewis/pixels-with-friends">GitHub</a>
    </Text>
  </FlexContainer>
);

export default Footer;
