import React from 'react';
import { useSelector } from 'react-redux';
import FlexContainer from './FlexContainer.jsx';
import PlayerView from './PlayerView.jsx';

/**
 * PlayerList component.
 *
 * @param {Object} props - Component props.
 * @returns {HTMLElement}
 */
const PlayerList = () => {
  const roomState = useSelector(state => state.roomState);

  const sortedPlayers = roomState.players.sort((a, b) => {
    if (a.score === b.score) return a.index < b.index ? -1 : 1;

    return a.score > b.score ? -1 : 1;
  });

  return (
    <FlexContainer
      style={{
        alignItems: 'left',
        minWidth: 300,
        marginTop: roomState.inGame ? 25 : 10,
        marginLeft: 35,
      }}>
      {sortedPlayers.map((p, i) => (
        <PlayerView
          key={p.playerName}
          player={p}
          sortIndex={i} />
      ))}
    </FlexContainer>
  );
};

export default PlayerList;
