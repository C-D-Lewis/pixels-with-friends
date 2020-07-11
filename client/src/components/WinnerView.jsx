import React from 'react';
import { useSelector } from 'react-redux';
import { SQUARE_SIZE, PlayerColors } from '../constants';
import FlexContainer from './FlexContainer.jsx';
import Text from './Text.jsx';

/**
 * WinnerView component.
 *
 * @param {Object} props - Component props.
 * @returns {HTMLElement}
 */
const WinnerView = () => {
  const roomState = useSelector(state => state.roomState);

  const topScore = roomState.players.reduce((acc, p) => p.score < acc ? acc : p.score, 0);
  const { playerName } = roomState.players.find(p => p.score === topScore);

  return (
    <FlexContainer
      style={{
        padding: '0px 12px',
        backgroundColor: 'gold',
        borderRadius: 15,
      }}>
      <Text style={{ fontSize: '1.8rem' }}>{playerName}</Text>
    </FlexContainer>
  );
};

export default WinnerView;
