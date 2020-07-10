import React from 'react';
import { useSelector } from 'react-redux';
import FlexContainer from './FlexContainer.jsx';
import GridSquare from './GridSquare.jsx';

/**
 * GameGrid component.
 *
 * @param {Object} props - Component props.
 * @returns {HTMLElement}
 */
const GameGrid = () => {
  const { grid } = useSelector(state => state.roomState);

  return (
    <FlexContainer style={{
      backgroundColor: '#444B',
      padding: 10,
      borderRadius: 10,
      minWidth: 340,
    }}>
      {grid.map((row) => (
        <FlexContainer key={row[0].key} style={{ flexDirection: 'row' }}>
          {row.map(square => <GridSquare key={square.key} square={square} />)}
        </FlexContainer>
      ))}
    </FlexContainer>
  );
};

export default GameGrid;