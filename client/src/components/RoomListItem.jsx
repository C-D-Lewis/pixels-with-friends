import React from 'react';
import { useDispatch } from 'react-redux';
import { setRoomName } from '../actions';
import Button from './Button.jsx';
import FlexContainer from './FlexContainer.jsx';
import Text from './Text.jsx';

/**
 * Show a room and its players.
 *
 * @param {Object} props - Component props.
 * @returns {HTMLElement}
 */
const RoomListItem = ({ room }) => {
  const dispatch = useDispatch();

  return (
    <FlexContainer style={{ flexDirection: 'row' }}>
      <Text style={{ margin: '10px 0px' }}>
        {`${room.roomName} - ${room.players.length} players`}
      </Text>
      <Button
        onClick={() => dispatch(setRoomName(room.roomName))}
        style={{
          fontSize: '0.9rem',
          marginLeft: 10,
          padding: '6px 7px',
        }}>
        Join
      </Button>
    </FlexContainer>
  );
};

export default RoomListItem;
