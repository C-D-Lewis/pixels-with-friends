import { createStore } from 'redux';
import { rootReducer } from './reducers';
import { TURN_TIME_MS, Pages } from './constants';

/** Initial store for the entire reducer. */
const INITIAL_STATE = {
  rooms: [],
  roomName: '',
  roomState: null,
  playerName: '',
  page: Pages.Landing,
  serverUrl: 'localhost',
  timeRemaining: TURN_TIME_MS,
};

const store = createStore(rootReducer, INITIAL_STATE);

export default store;
