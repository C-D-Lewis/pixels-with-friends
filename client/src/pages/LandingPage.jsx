import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setPlayerName,
  setRoomName,
  setRoomState,
  setPage,
  setServerUrl,
  setRooms,
} from '../actions';
import { Pages } from '../constants';
import Button from '../components/Button.jsx';
import Fader from '../components/Fader.jsx';
import FlexContainer from '../components/FlexContainer.jsx';
import Input from '../components/Input.jsx';
import Text from '../components/Text.jsx';
import audioService from '../services/audioService';
import apiService from '../services/apiService';

/**
 * Test a room or player name is valid input.
 *
 * @param {string} name - Room or player name proposed.
 * @returns {boolean} true if the name is valid.
 */
const nameIsValid = name => name && name.length > 1 && !name.includes(' ');

/**
 * Get a query param.
 *
 * @param {string} name - Param to find.
 * @returns {string} found value.
 */
const getQueryParam = name => new URLSearchParams(window.location.search).get(name);

/**
 * Show a room and its players.
 *
 * @param {Object} props - Component props.
 * @returns {HTMLElement}
 */
const RoomListItem = ({ room }) => (
  <Text style={{ margin: '10px 0px' }}>{`${room.roomName} - ${room.players.length} players`}</Text>
);

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
  const rooms = useSelector(state => state.rooms);

  const readyToJoin = serverUrl.length && nameIsValid(roomName) && nameIsValid(playerName);

  /**
   * Enter the room as the player.
   */
  const enterRoom = async () => {
    if (!readyToJoin) return;

    try {
      // Ensure the room exists
      await apiService.getRoom();

      // Add the player to the lobby
      const newRoomState = await apiService.putPlayerInRoom();
      audioService.play('join.mp3');
      dispatch(setRoomState(newRoomState));
      dispatch(setPage(Pages.Lobby));
    } catch (e) {
      console.log(e);
      alert(e);
    }
  };

  // When the component is mounted
  useEffect(() => {
    dispatch(setServerUrl(window.config.serverUrl));
    dispatch(setRoomName(getQueryParam('roomName') || ''));

    apiService.getRooms()
      .then(({ rooms: initialRooms }) => dispatch(setRooms(initialRooms)));

    apiService.pollRooms();
    return () => apiService.stopPollRooms();
  }, []);

  return (
    <Fader>
      <FlexContainer
        style={{
          marginTop: 15,
          height: '100%',
        }}>
        <Text style={{ margin: '10px 5px 0px 0px' }}>Player Name</Text>
        <Input
          placeholder="Player name..."
          value={playerName}
          onChange={v => dispatch(setPlayerName(v))}/>
        <Text style={{ margin: '10px 5px 0px 0px' }}>Room Name</Text>
        <Input
          placeholder="Room name..."
          value={roomName}
          onChange={v => dispatch(setRoomName(v))}/>
        <Fader when={readyToJoin}>
          <Button onClick={() => enterRoom(roomName)}>Join room</Button>
        </Fader>

        {rooms && rooms.length > 0 && (
          <FlexContainer style={{ marginTop: 10 }}>
            <Text style={{ fontSize: '1.3rem' }}>Open Rooms:</Text>
            {rooms.map(p => <RoomListItem key={p.roomName} room={p} />)}
          </FlexContainer>
        )}
      </FlexContainer>
    </Fader>
  );
};

export default LandingPage;
