import { createStore } from 'redux';
import { rootReducer } from './reducers';

/** Initial store for the entire reducer. */
const INITIAL_STATE = {
  roomName: null,
};

const store = createStore(rootReducer, INITIAL_STATE);

export default store;
