import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SQUARE_SIZE, PlayerColors } from '../constants';
import { setRoomState } from '../actions';
import FlexContainer from './FlexContainer.jsx';
import audioService from '../services/audioService';
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
  let backgroundColor = 'white';
  if (square.playerName) {
    const ownerPlayer = roomState.players.find(p => p.playerName === square.playerName);
    if (ownerPlayer) {
      const ownerIndex = roomState.players.indexOf(ownerPlayer);
      backgroundColor = PlayerColors[ownerIndex].light;
    } else {
      // They left, square is dead
      backgroundColor = 'black';
    }
  }

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
      audioService.play('take.mp3');
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
        backgroundColor,
        margin: 2,
        border: `2px solid ${square.inShape ? 'gold' : 'black'}`,
        borderRadius: 5,
        transform: `rotateY(${square.playerName ? 180 : 0}deg)`,
        transition: '0.4s',
      }}>
    </FlexContainer>
  );
};

export default GridSquare;
