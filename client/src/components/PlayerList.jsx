import React from 'react';
import { useSelector } from 'react-redux';
import { SQUARE_SIZE, PlayerColors } from '../constants';
import FlexContainer from './FlexContainer.jsx';
import Text from './Text.jsx';

/**
 * HostPill component.
 *
 * @param {Object} props - Component props.
 * @returns {HTMLElement}
 */
const HostPill = () => (
  <div
    style={{
      backgroundColor: 'rgb(234, 186, 0)',
      color: 'white',
      padding: '3px 8px',
      marginLeft: 10,
      borderRadius: 50,
    }}>
    Host
  </div>
);

/**
 * PlayerView component.
 *
 * @param {Object} props - Component props.
 * @returns {HTMLElement}
 */
const PlayerView = ({ roomState, index }) => {
  const player = roomState.players[index];

  return (
    <FlexContainer style={{ flexDirection: 'row' }}>
      <div
        style={{
          width: SQUARE_SIZE,
          height: SQUARE_SIZE,
          backgroundColor: PlayerColors[index],
          borderRadius: 5,
          marginRight: 10,
        }}/>
      <Text>{player.playerName}</Text>
      {roomState.inGame == true && <Text style={{ marginLeft: 20 }}>{player.score} points</Text>}
      {index === 0 && <HostPill />}
    </FlexContainer>
  );
};

/**
 * PlayerList component.
 *
 * @param {Object} props - Component props.
 * @returns {HTMLElement}
 */
const PlayerList = () => {
  const roomState = useSelector(state => state.roomState);

  // In game only - support score count and showing whose turn it is

  return (
    <FlexContainer style={{ alignItems: 'left' }}>
      {roomState.players.map((p, i) => <PlayerView key={p.playerName} roomState={roomState} index={i} />)}
    </FlexContainer>
  );
};

export default PlayerList;
