import store from '../store';
import { setRoomState } from '../actions';

/** API root */
const API = 'http://localhost:5500';
/** Room poll interval */
const ROOM_POLL_INTERVAL_MS = 1000;

const request = async (method, path, json) => {
  const { serverUrl } = store.getState();

  const apiUrl = `http://${serverUrl}:5500`;
  const res = await fetch(`${apiUrl}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    ...{ body: json ? JSON.stringify(json): null },
  });

  if (res.status > 400) throw new Error(`Error: ${await res.text()}`)
  return await res.json();
};

/**
 * Get a room from the service.
 *
 * @returns {Promise<Object>} Promise resolving to the room response.
 */
const getRoom = async () => {
  const { roomName, playerName } = store.getState();
  if (!roomName && !playerName) return;

  return await request('GET', `/rooms/${roomName}?playerName=${playerName}`);
};

/**
 * Get a room from the service.
 *
 * @returns {Promise<Object>} Promise resolving to the room response.
 */
const putPlayerInRoom = async () => {
  const { roomName, playerName } = store.getState();

  return await request('PUT', `/rooms/${roomName}/player`, { playerName });
};

/**
 * Poll the room state, and by doing so keep the player alive in the server's eyes.
 */
const pollRoomState = () => {
  setInterval(async () => {
    const { roomState } = store.getState();
    if (!roomState) return;

    const newState = await getRoom();
    store.dispatch(setRoomState(newState));
  }, ROOM_POLL_INTERVAL_MS);
};

const apiService = {
  getRoom,
  putPlayerInRoom,
  pollRoomState,
};

export default apiService;
