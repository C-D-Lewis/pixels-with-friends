import React from 'react';
import FlexContainer from './FlexContainer.jsx';
import GridSquare from './GridSquare.jsx';

/**
 * GameGrid component.
 *
 * @param {Object} props - Component props.
 * @returns {HTMLElement}
 */
const GameGrid = ({ grid }) => (
  <FlexContainer>
    {grid.map((row) => (
      <FlexContainer key={row[0].key} style={{ flexDirection: 'row' }}>
        {row.map(square => <GridSquare key={square.key} square={square} />)}
      </FlexContainer>
    ))}
  </FlexContainer>
);

export default GameGrid;