import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPlayerName, setRoomName, setRoom, setPage } from '../actions';
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
 * LandingPage component.
 *
 * @returns {HTMLElement}
 */
const LandingPage = () => {
  const dispatch = useDispatch();

  const roomName = useSelector(state => state.roomName);
  const playerName = useSelector(state => state.playerName);

  /**
   * Enter the room as the player.
   */
  const enterRoom = async () => {
    try {
      // Ensure the room exists
      await apiService.getRoom(roomName);

      // Add the player
      const newRoomState = await apiService.putPlayerInRoom(roomName, playerName);
      dispatch(setRoom(newRoomState));

      dispatch(setPage(Pages.Lobby));
    } catch (e) {
      console.log(e);
      alert(e);
    }
  };

  return (
    <Fader>
      <FlexContainer>
        <Text>Enter a room name to begin!</Text>
        <Input
          placeholder="Player name..."
          onChange={v => dispatch(setPlayerName(v))}/>
        <Input
          placeholder="Room name..."
          onChange={v => dispatch(setRoomName(v))}/>
        <Fader when={nameIsValid(roomName) && nameIsValid(playerName)}>
          <Button onClick={() => enterRoom(roomName)}>Join room</Button>
        </Fader>
      </FlexContainer>
    </Fader>
  );
};

export default LandingPage;
