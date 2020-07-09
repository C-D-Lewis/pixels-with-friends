import { createStore } from 'redux';
import { rootReducer } from './reducers';
import { Pages } from './constants';

/** Initial store for the entire reducer. */
const INITIAL_STATE = {
  roomName: '',
  roomState: null,
  playerName: '',
  page: Pages.Landing,
  serverUrl: 'localhost',
};

const store = createStore(rootReducer, INITIAL_STATE);

export default store;
