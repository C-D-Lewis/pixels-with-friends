import React from 'react';
import { useSelector } from 'react-redux';
import { SQUARE_SIZE, PlayerColors } from '../constants';
import FlexContainer from './FlexContainer.jsx';
import Text from './Text.jsx';

/**
 * WinningTeamView component.
 *
 * @param {Object} props - Component props.
 * @returns {HTMLElement}
 */
const WinningTeamView = () => {
  const roomState = useSelector(state => state.roomState);

  const teamScores = roomState.players.reduce((acc, p) => {
    if (!acc[p.color]) {
      acc[p.color] = 0;
    }

    acc[p.color] += p.score;
    return acc;;
  }, {});
  const topTeam = Object.entries(teamScores)
    .reduce(
      (acc, [color, score]) => {
        if (score < acc.score) return acc;

        return { color, score };
      },
      { color: '', score: 0 },
    );
  const teamName = `${topTeam.color.charAt(0).toUpperCase()}${topTeam.color.slice(1)}`;

  return (
    <FlexContainer
      style={{
        padding: '0px 12px',
        backgroundColor: PlayerColors.find(p => p.name === topTeam.color).dark,
        borderRadius: 15,
      }}>
      <Text style={{ fontSize: '1.8rem' }}>{`${teamName} team`}</Text>
    </FlexContainer>
  );
};

export default WinningTeamView;
