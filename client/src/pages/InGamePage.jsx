import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPage } from '../actions';
import { Pages } from '../constants';
import Fader from '../components/Fader.jsx';
import FlexContainer from '../components/FlexContainer.jsx';
import GameGrid from '../components/GameGrid.jsx';
import PlayerList from '../components/PlayerList.jsx';
import Text from '../components/Text.jsx';
import TimeRemaining from '../components/TimeRemaining.jsx';
import apiService from '../services/apiService';

/**
 * InGamePage component.
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
    return () => apiService.stopPollRoomState();
  }, []);

  // When room state updates, game state changed
  useEffect(() => {
    if (!roomState) return;

    // Host left?
    if (!roomState.players.find(p => p.isHost)) {
      alert('Host left the game');
      dispatch(setPage(Pages.Landing));
      return;
    }

    // Winner?
    if (roomState.allSquaresFilled) {
      setTimeout(() => {
        dispatch(setPage(Pages.EndGame));
      }, 1000);
    }
  }, [roomState]);

  return (
    <Fader>
      <FlexContainer>
        <Text>{`It's ${roomState.currentPlayer}'s turn!`}</Text>
        <TimeRemaining />
        <FlexContainer
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginTop: 15,
          }}>
          <GameGrid />
          <PlayerList />
        </FlexContainer>
      </FlexContainer>
    </Fader>
  );
};

export default InGamePage;
