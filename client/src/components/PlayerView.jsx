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

  const isHost = !!roomState.players.find(p => p.playerName === playerName && p.isHost);
  const isMyTurn = player.playerName === roomState.currentPlayer && roomState.inGame;

  return (
    <div
      onClick={async () => {
        if (page !== Pages.Lobby) return;

        // Player can change their own team color
        if (playerName === player.playerName) {
          await apiService.nextPlayerColor();
          audioService.play('take.mp3');
        }

        // Host can change bot colors
        if (isHost) {
          await apiService.nextPlayerColor(player.playerName);
          audioService.play('take.mp3');
        }
      }}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: SQUARE_SIZE,
        height: SQUARE_SIZE,
        backgroundColor: PlayerColors.find(p => p.name === player.color).light,
        borderRadius: 5,
        marginRight: 10,
        border: isMyTurn ? '2px solid white' : '2px solid black',
      }}>
      {player.botData !== null && (
        <img style={{ width: 20, height: 20 }} src="assets/images/robot.png"/>
      )}
    </div>
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
  const playerName = useSelector(state => state.playerName);
  const roomState = useSelector(state => state.roomState);

  const isHost = !!roomState.players.find(p => p.playerName === playerName && p.isHost);

  let botLevel;
  if (player.botData) {
    botLevel = {
      0: 'Easy',
      1: 'Medium',
      2: 'Hard',
    }[player.botData.level];
  }

  /**
   * Increment a bot's level.
   */
  const setBotLevel = async () => {
    if (!isHost) return;

    try {
      await apiService.botNextLevel(player.playerName);
      audioService.play('take.mp3');
    } catch (e) {
      alert(e);
      console.log(e);
    }
  };

  return (
    <FlexContainer style={{ flexDirection: 'row' }}>
      <PlayerColorBadge player={player} />
      <Text>{player.playerName}</Text>
      {page !== Pages.Lobby && <Text style={{ marginLeft: 20 }}>{`${player.score} points`}</Text>}
      {player.isHost == true && <Pill backgroundColor="rgb(234, 186, 0)">Host</Pill>}
      {player.botData !== null && (
        <Pill
          onClick={setBotLevel}
          backgroundColor="darkgrey">
          {botLevel}
        </Pill>
      )}
    </FlexContainer>
  );
};

export default PlayerView;
