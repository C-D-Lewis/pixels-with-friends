import React from 'react';
import { useSelector } from 'react-redux';
import { SQUARE_SIZE, Pages, PlayerColors } from '../constants';
import FlexContainer from './FlexContainer.jsx';
import Pill from './Pill.jsx';
import Text from './Text.jsx';
import apiService from '../services/apiService';
import audioService from '../services/audioService';

/**
 * PlayerColorBadge component.
 *
 * @param {Object} props - Component props.
 * @returns {HTMLElement}
 */
const PlayerColorBadge = ({ player }) => {
  const page = useSelector(state => state.page);
  const playerName = useSelector(state => state.playerName);
  const roomState = useSelector(state => state.roomState);

  const isMyTurn = player.playerName === roomState.currentPlayer && roomState.inGame;

  return (
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
  );
};

/**
 * PlayerView component.
 *
 * @param {Object} props - Component props.
 * @returns {HTMLElement}
 */
const PlayerView = ({ player, sortIndex }) => {
  const page = useSelector(state => state.page);

  return (
    <FlexContainer style={{ flexDirection: 'row' }}>
      <PlayerColorBadge player={player} />
      <Text>{player.playerName}</Text>
      {page !== Pages.Lobby && <Text style={{ marginLeft: 20 }}>{`${player.score} points`}</Text>}
      {player.isHost == true && <Pill backgroundColor="rgb(234, 186, 0)">Host</Pill>}
      {player.botData !== null && <Pill backgroundColor="darkgrey">CPU</Pill>}
    </FlexContainer>
  );
};

export default PlayerView;
