import { combineReducers } from 'redux';
import { Pages } from './constants';

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
  roomName: buildReducer(null, {
    SET_ROOM_NAME: (state, { roomName }) => roomName,
  }),
  roomState: buildReducer(null, {
    SET_ROOM_STATE: (state, { roomState }) => roomState,
  }),
  playerName: buildReducer(null, {
    SET_PLAYER_NAME: (state, { playerName }) => playerName,
  }),
  page: buildReducer(Pages.Landing, {
    SET_PAGE: (state, { page }) => page,
  }),
  serverUrl: buildReducer(null, {
    SET_SERVER_URL: (state, { serverUrl }) => serverUrl,
  }),
});
