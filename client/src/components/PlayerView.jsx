import React from 'react';
import { useSelector } from 'react-redux';
import { SQUARE_SIZE, Pages, PlayerColors } from '../constants';
import FlexContainer from './FlexContainer.jsx';
import HostPill from './HostPill.jsx';
import Text from './Text.jsx';

/**
 * PlayerView component.
 *
 * @param {Object} props - Component props.
 * @returns {HTMLElement}
 */
const PlayerView = ({ roomState, index }) => {
  const player = roomState.players[index];
  const isMyTurn = player.playerName === roomState.currentPlayer && roomState.inGame;

  const page = useSelector(state => state.page);

  return (
    <FlexContainer style={{ flexDirection: 'row' }}>
      <div
        style={{
          width: SQUARE_SIZE,
          height: SQUARE_SIZE,
          backgroundColor: PlayerColors[index].light,
          borderRadius: 5,
          marginRight: 10,
          border: isMyTurn ? '2px solid white' : '2px solid black',
        }}/>
      <Text>{player.playerName}</Text>
      {page !== Pages.Lobby && <Text style={{ marginLeft: 20 }}>{`${player.score} points`}</Text>}
      {index === 0 && <HostPill />}
    </FlexContainer>
  );
};

export default PlayerView;
