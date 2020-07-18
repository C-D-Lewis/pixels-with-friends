import React from 'react';
import { useSelector } from 'react-redux';
import FlexContainer from './FlexContainer.jsx';
import Text from './Text.jsx';

const Row = ({ children, header = false }) => (
  <FlexContainer
    style={{
      flexDirection: 'row',
      minWidth: 300,
      backgroundColor: header ? 'white' : '#fff2',
    }}>
    {children}
  </FlexContainer>
);

const Cell = ({ children, header = false }) => (
  <FlexContainer
    style={{
      flexDirection: 'row',
      flex: 1,
      justifyContent: 'center',
    }}>
    <Text
      style={{
        color: header ? 'black' : 'white',
        margin: '10px 0px',
        textAlign: 'center',
      }}>
      {children}
    </Text>
  </FlexContainer>
);

/**
 * StatsTable component.
 *
 * @param {Object} props - Component props.
 * @returns {HTMLElement}
 */
const StatsTable = () => {
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
        marginTop: 10,
        borderRadius: 5,
        overflow: 'hidden',
      }}>
      <Row header={true}>
        <Cell header={true}>Name</Cell>
        <Cell header={true}>Captures</Cell>
        <Cell header={true}>Runs</Cell>
        <Cell header={true}>Longest Run</Cell>
      </Row>
      {sortedPlayers.map((p, i) => (
        <Row>
          <Cell>{p.playerName}</Cell>
          <Cell>{p.conversions}</Cell>
          <Cell>{p.runs}</Cell>
          <Cell>{p.bestRunLength}</Cell>
        </Row>
      ))}
    </FlexContainer>
  );
};

export default StatsTable;
