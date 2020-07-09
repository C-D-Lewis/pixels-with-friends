import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SQUARE_SIZE, PlayerColors } from '../constants';
import { setRoomState } from '../actions';
import FlexContainer from './FlexContainer.jsx';
import apiService from '../services/apiService';

/**
 * GridSquare component.
 *
 * @param {Object} props - Component props.
 * @returns {HTMLElement}
 */
const GridSquare = ({ square }) => {
  const dispatch = useDispatch();

  const playerName = useSelector(state => state.playerName);
  const roomState = useSelector(state => state.roomState);

  const myTurn = roomState.currentPlayer === playerName;
  // FIXME: Handle a player leaving (not host)
  const ownerPlayer = roomState.players.find(p => p.playerName === square.playerName);
  const ownerIndex = roomState.players.indexOf(ownerPlayer);

  /**
   * Take a turn.
   */
  const takeTurn = async () => {
    // Not my turn
    if (!myTurn) return;
    // Square already taken
    if (square.playerName) return;

    try {
      const newRoomState = await apiService.takeSquare(square);
      dispatch(setRoomState(newRoomState));
    } catch (e) {
      console.log(e);
      alert(e);
    }
  };

  return (
    <FlexContainer
      className="grid-square"
      onClick={takeTurn}
      style={{
        width: SQUARE_SIZE,
        height: SQUARE_SIZE,
        backgroundColor: square.playerName ? PlayerColors[ownerIndex].light : 'white',
        margin: 2,
        border: '1px solid black',
        borderRadius: 5,
        transition: '1s',
      }}>
    </FlexContainer>
  );
};

export default GridSquare;
