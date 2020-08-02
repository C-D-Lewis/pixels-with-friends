import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTimeRemaining } from '../actions';
import { TURN_TIME_MS } from '../constants';
import store from '../store';
import Text from './Text.jsx';
import FlexContainer from './FlexContainer.jsx';
import apiService from '../services/apiService';

/** Timer interval */
const TIMER_INTERVAL_MS = 500;

/**
 * Zeropad a number.
 *
 * @param {number} v - Value to pad.
 * @returns {number} Padded value.
 */
const zeroPad = v => v < 10 ? `0${v}` : v;

/**
 * TimeRemaining component.
 *
 * @param {Object} props - Component props.
 * @returns {HTMLElement}
 */
const TimeRemaining = () => {
  const dispatch = useDispatch();

  const timeRemaining = useSelector(state => state.timeRemaining);
  const roomState = useSelector(state => state.roomState);
  const playerName = useSelector(state => state.playerName);

  const myTurn = roomState.currentPlayer === playerName;

  // Decrease time remaining
  useEffect(() => {
    const handle = setInterval(() => {
      const { timeRemaining: trNow } = store.getState();
      if (trNow <= 0) return;

      dispatch(setTimeRemaining(trNow - TIMER_INTERVAL_MS));
    }, TIMER_INTERVAL_MS);

    return () => clearInterval(handle);
  }, []);

  // When time's up, signal next player's turn
  useEffect(() => {
    if ((timeRemaining < TIMER_INTERVAL_MS) && myTurn) {
      apiService.nextTurn();
      return;
    }
  }, [timeRemaining]);

  // Reset when it's my turn
  useEffect(() => {
    if (!myTurn) return;

    dispatch(setTimeRemaining(TURN_TIME_MS));
  }, [myTurn]);

  const barMaxWidth = 200;
  const width = Math.round((timeRemaining * barMaxWidth) / TURN_TIME_MS);

  return (
    <FlexContainer
      style={{
        flexDirection: 'row',
        justifyContent: 'flex-start',
        width: 300,
        height: 15,
      }}>
      {myTurn == true && (
        <FlexContainer
          style={{
            justifyContent: 'flex-start',
            flexDirection: 'row',
          }}>
          <Text style={{ margin: '2px 10px' }}>
            {`${Math.round(timeRemaining / 1000)}s`}
          </Text>
          <div
            style={{
              backgroundColor: 'white',
              height: 5,
              width: `${width}px`,
              transition: '0.5s',
              transitionTimingFunction: 'linear',
            }} />
        </FlexContainer>
      )}
    </FlexContainer>
  );
};

export default TimeRemaining;
