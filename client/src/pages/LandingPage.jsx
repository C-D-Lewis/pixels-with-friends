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
import { getQueryParam, nameIsValid, generateRoomName } from '../util';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import Fader from '../components/Fader.jsx';
import FlexContainer from '../components/FlexContainer.jsx';
import Input from '../components/Input.jsx';
import Text from '../components/Text.jsx';
import Subtitle from '../components/Subtitle.jsx';
import RoomListItem from '../components/RoomListItem.jsx';
import audioService from '../services/audioService';
import apiService from '../services/apiService';

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
    dispatch(setRoomName(getQueryParam('room') || generateRoomName()));

    apiService.getRooms()
      .then(({ rooms: initialRooms }) => dispatch(setRooms(initialRooms)));

    apiService.pollRooms();
    return () => apiService.stopPollRooms();
  }, []);

  const cardTextStyle = { margin: '10px 5px 0px 0px', color: 'black' };

  return (
    <Fader>
      <FlexContainer style={{ marginTop: 15, height: '100%' }}>
        <Card>
          <Text style={cardTextStyle}>
            Player Name
          </Text>
          <Input
            placeholder="Type a name..."
            value={playerName}
            onChange={v => dispatch(setPlayerName(v))}/>
          {playerName.length > 1 && (
            <FlexContainer>
              <Text style={cardTextStyle}>
                Room Name
              </Text>
              <Input
                placeholder="Type a name..."
                value={roomName}
                onChange={v => dispatch(setRoomName(v))}/>
              <Button
                disabled={!readyToJoin}
                style={{ marginTop: 10 }}
                onClick={() => enterRoom(roomName)}>
                Join room
              </Button>
            </FlexContainer>
          )}
        </Card>

        {rooms && rooms.length > 0 && playerName.length > 1 && (
          <FlexContainer style={{ marginTop: 10 }}>
            <Subtitle>Open Rooms:</Subtitle>
            {rooms.map(p => <RoomListItem key={p.roomName} room={p} />)}
          </FlexContainer>
        )}

        <FlexContainer style={{ alignItems: 'start' }}>
          <Subtitle>How to Play</Subtitle>
          <Text style={{ margin: '4px 4px 8px 20px' }}>
            - Create a run of four or more for bonus points.
          </Text>
          <Text style={{ margin: '4px 4px 8px 20px' }}>
            - Surround another player's tile on all four sides to capture it.
          </Text>
          <Text style={{ margin: '4px 4px 8px 20px' }}>
            - Look out for 2x tiles for double points.
          </Text>
        </FlexContainer>
      </FlexContainer>
    </Fader>
  );
};

export default LandingPage;
