import React from 'react';
import { useSelector } from 'react-redux';
import { SQUARE_SIZE, Pages, PlayerColors } from '../constants';
import FlexContainer from './FlexContainer.jsx';
import PlayerView from './PlayerView.jsx';
import Text from './Text.jsx';

/**
 * PlayerList component.
 *
 * @param {Object} props - Component props.
 * @returns {HTMLElement}
 */
const PlayerList = () => {
  const roomState = useSelector(state => state.roomState);

  return (
    <FlexContainer
      style={{
        alignItems: 'left',
        minWidth: 300,
        marginTop: roomState.inGame ? 25 : 10,
        marginLeft: 35,
      }}>
      {roomState.players.map((p, i) => <PlayerView key={p.playerName} roomState={roomState} index={i} />)}
    </FlexContainer>
  );
};

export default PlayerList;
