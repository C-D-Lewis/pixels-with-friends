import React from 'react';
import FlexContainer from './FlexContainer.jsx';
import { SQUARE_SIZE, PlayerColors } from '../constants';

/**
 * GridSquare component.
 *
 * @param {Object} props - Component props.
 * @returns {HTMLElement}
 */
const GridSquare = ({ square }) => (
  <FlexContainer
    style={{
      width: SQUARE_SIZE,
      height: SQUARE_SIZE,
      backgroundColor: square.player ? PlayerColors[square.player] : 'white',
      margin: 2,
      border: '1px solid #444',
      borderRadius: 5,
    }}>
  </FlexContainer>
);

export default GridSquare;
