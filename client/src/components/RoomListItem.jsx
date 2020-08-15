import React from 'react';
import { useDispatch } from 'react-redux';
import { setRoomName, setRoomState, setPage } from '../actions';
import { Pages } from '../constants';
import Button from './Button.jsx';
import FlexContainer from './FlexContainer.jsx';
import Text from './Text.jsx';
import apiService from '../services/apiService';
import audioService from '../services/audioService';

/**
 * Show a room and its players.
 *
 * @param {Object} props - Component props.
 * @returns {HTMLElement}
 */
const RoomListItem = ({ room }) => {
  const dispatch = useDispatch();

  /**
   * Enter the room as the player - same as LandingPage
   */
  const enterRoom = async () => {
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

  return (
    <FlexContainer style={{ flexDirection: 'row' }}>
      <Text style={{ margin: '10px 0px', color: 'black' }}>
        {`${room.roomName} - ${room.players.length} players`}
      </Text>
      <Button
        onClick={() => {
          dispatch(setRoomName(room.roomName));
          enterRoom();
        }}
        style={{
          fontSize: '0.9rem',
          marginLeft: 10,
          padding: '8px 9px',
        }}>
        Join
      </Button>
    </FlexContainer>
  );
};

export default RoomListItem;
