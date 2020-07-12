import React from 'react';
import { useSelector } from 'react-redux';
import { SQUARE_SIZE, Pages, PlayerColors } from '../constants';
import FlexContainer from './FlexContainer.jsx';
import HostPill from './HostPill.jsx';
import Text from './Text.jsx';
import apiService from '../services/apiService';
import audioService from '../services/audioService';

/**
 * PlayerView component.
 *
 * @param {Object} props - Component props.
 * @returns {HTMLElement}
 */
const PlayerView = ({ roomState, index }) => {
  const page = useSelector(state => state.page);
  const playerName = useSelector(state => state.playerName);

  const player = roomState.players[index];
  const isMyTurn = player.playerName === roomState.currentPlayer && roomState.inGame;

  return (
    <FlexContainer style={{ flexDirection: 'row' }}>
      <div
        onClick={async () => {
          if (page !== Pages.Lobby || playerName !== player.playerName) return;

          await apiService.nextPlayerColor();
          audioService.play('take.mp3');
        }}
        style={{
          width: SQUARE_SIZE,
          height: SQUARE_SIZE,
          backgroundColor: PlayerColors.find(p => p.name === player.color).light,
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
