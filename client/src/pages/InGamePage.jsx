import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPage, setRoomState } from '../actions';
import { Pages } from '../constants';
import Fader from '../components/Fader.jsx';
import FlexContainer from '../components/FlexContainer.jsx';
import GameGrid from '../components/GameGrid.jsx';
import PlayerList from '../components/PlayerList.jsx';
import Text from '../components/Text.jsx';
import apiService from '../services/apiService';

/**
 * InGamePage component.
 *
 * Shows the grid, player list and their scores.
 *
 * @returns {HTMLElement}
 */
const InGamePage = () => {
  const dispatch = useDispatch();

  const roomState = useSelector(state => state.roomState);
  const playerName = useSelector(state => state.playerName);

  // Check room state while waiting.
  useEffect(() => {
    apiService.pollRoomState();

    return () => apiService.stopPolling();
  }, []);

  // When room state updates, game state changed
  useEffect(() => {
    if (!roomState) return;

    // Board update?

    // Player score update?

    // Did someone win? Did the game end?
  }, [roomState]);

  return (
    <Fader>
      <FlexContainer>
        <Text>{`You are in "${roomState.roomName}"`}</Text>
        <GameGrid />
        <FlexContainer style={{ marginTop: 15 }}>
          <PlayerList />
        </FlexContainer>
      </FlexContainer>
    </Fader>
  );
};

export default InGamePage;
