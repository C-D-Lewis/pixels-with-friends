import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPage, setRoomState } from '../actions';
import { Pages } from '../constants';
import Button from '../components/Button.jsx';
import Fader from '../components/Fader.jsx';
import FlexContainer from '../components/FlexContainer.jsx';
import Input from '../components/Input.jsx';
import PlayerList from '../components/PlayerList.jsx';
import Text from '../components/Text.jsx';
import apiService from '../services/apiService';

/**
 * LobbyPage component.
 *
 * @returns {HTMLElement}
 */
const LobbyPage = () => {
  const dispatch = useDispatch();

  const roomState = useSelector(state => state.roomState);
  const playerName = useSelector(state => state.playerName);

  const isHost = roomState.players[0] && roomState.players[0].playerName === playerName;
  const gameCanStart = roomState.players.length > 1;
  const hostCanStartGame = gameCanStart && isHost;

  // Check room state while waiting.
  useEffect(() => {
    apiService.pollRoomState();

    return () => apiService.stopPolling();
  }, []);

  // When room state updates, game could have begun
  useEffect(() => {
    if (!roomState) return;

    if (roomState.inGame) dispatch(setPage(Pages.InGame));
  }, [roomState]);

  /**
   * Host starts the game.
   */
  const startGame = async () => {
    try {
      const updatedRoomState = await apiService.putRoomInGame();
      dispatch(setRoomState(updatedRoomState));

      // Go to game!
      dispatch(setPage(Pages.InGame));
    } catch (e) {
      console.log(e);
      alert(e);
    }
  };

  return (
    <Fader>
      <FlexContainer>
        <Text>{`You are in "${roomState.roomName}"`}</Text>
        <PlayerList />
        {hostCanStartGame == false && (
          <Text style={{ margin: 15, textAlign: 'center' }}>
            The host can start the game after two or more players have joined.
          </Text>
        )}
        <Fader when={hostCanStartGame}>
          <Button onClick={startGame}>Start game</Button>
        </Fader>
      </FlexContainer>
    </Fader>
  );
};

export default LobbyPage;
