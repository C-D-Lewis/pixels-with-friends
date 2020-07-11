import { combineReducers } from 'redux';
import { Pages } from './constants';
import audioService from './services/audioService';

/**
 * Build a reducer from a map of action types to handlers.
 *
 * @param {*} firstValue - First value of the reducer.
 * @param {Object} subreducers - Map of subreducers.
 * @returns {Function} Function called with initial state and action to process.
 */
const buildReducer = (firstValue, subreducers) => (state = firstValue, action) =>
    subreducers[action.type]
      ? subreducers[action.type](state, action)
      : state;

export const rootReducer = combineReducers({
  roomName: buildReducer('', {
    SET_ROOM_NAME: (state, { roomName }) => roomName,
  }),
  roomState: buildReducer(null, {
    SET_ROOM_STATE: (state, { roomState }) => {
      if (!state) return roomState;
      if (!roomState) return roomState;

      // Player left?
      if (state.players.length > roomState.players.length) {
        audioService.play('leave.mp3');
      }
      if (state.players.length < roomState.players.length) {
        audioService.play('join.mp3');
      }

      // Square taken?
      if (JSON.stringify(state.grid) !== JSON.stringify(roomState.grid)) {
        audioService.play('take.mp3');
      }

      return roomState;
    },
  }),
  playerName: buildReducer('', {
    SET_PLAYER_NAME: (state, { playerName }) => playerName,
  }),
  page: buildReducer(Pages.Landing, {
    SET_PAGE: (state, { page }) => page,
  }),
  serverUrl: buildReducer('', {
    SET_SERVER_URL: (state, { serverUrl }) => serverUrl,
  }),
  rooms: buildReducer([], {
    SET_ROOMS: (state, { rooms }) => rooms,
  }),
});
