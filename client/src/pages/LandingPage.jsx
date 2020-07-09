import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPlayerName, setRoomName, setRoomState, setPage, setServerUrl } from '../actions';
import { Pages } from '../constants';
import Button from '../components/Button.jsx';
import Fader from '../components/Fader.jsx';
import FlexContainer from '../components/FlexContainer.jsx';
import Input from '../components/Input.jsx';
import Text from '../components/Text.jsx';
import apiService from '../services/apiService';

/**
 * Test a room or player name is valid input.
 *
 * @param {string} name - Room or player name proposed.
 * @returns {boolean} true if the name is valid.
 */
const nameIsValid = name => (
  name &&
  name.length > 1 &&
  !name.includes(' ')
);

/**
 * Get a query param.
 *
 * @param {string} name - Param to find.
 * @returns {string} found value.
 */
const getQueryParam = name => new URLSearchParams(window.location.search).get(name);

/**
 * LandingPage component.
 *
 * @returns {HTMLElement}
 */
const LandingPage = () => {
  const dispatch = useDispatch();

  const serverUrl = useSelector(state => state.serverUrl);
  const playerName = useSelector(state => state.playerName);
  const roomName = useSelector(state => state.roomName);

  const readyToJoin = serverUrl.length && nameIsValid(roomName) && nameIsValid(playerName);

  /**
   * Enter the room as the player.
   */
  const enterRoom = async () => {
    if (!readyToJoin) return;

    try {
      // Ensure the room exists
      const currentRoomState = await apiService.getRoom();

      // If room is inGame, player cannot join (yet?)
      if (currentRoomState.inGame) {
        alert('Game has already begun, sorry!');
        return;
      }

      // Add the player
      const initialRoomState = await apiService.putPlayerInRoom();
      dispatch(setRoomState(initialRoomState));

      // Go to lobby
      dispatch(setPage(Pages.Lobby));
    } catch (e) {
      console.log(e);
      alert(e);
    }
  };

  // When the component is mounted
  useEffect(() => {
    const serverUrlParam = getQueryParam('serverUrl');
    if (serverUrlParam) dispatch(setServerUrl(serverUrlParam));
    const roomNameParam = getQueryParam('roomName');
    if (roomNameParam) dispatch(setRoomName(roomNameParam));
  }, []);

  return (
    <Fader>
      <FlexContainer>
        <Text>Enter the following details to begin!</Text>
        <Input
          placeholder="Server..."
          value={serverUrl}
          onChange={v => dispatch(setServerUrl(v))}/>
        <Input
          placeholder="Player name..."
          value={playerName}
          onChange={v => dispatch(setPlayerName(v))}/>
        <Input
          placeholder="Room name..."
          value={roomName}
          onChange={v => dispatch(setRoomName(v))}/>
        <Fader when={readyToJoin}>
          <Button onClick={() => enterRoom(roomName)}>Join room</Button>
        </Fader>
      </FlexContainer>
    </Fader>
  );
};

export default LandingPage;
