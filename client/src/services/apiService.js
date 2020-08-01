import store from '../store';
import { setRoomState, setRooms } from '../actions';

/** Room poll interval */
const ROOM_POLL_INTERVAL_MS = 1000;
/** Rooms poll interval */
const ROOMS_POLL_INTERVAL_MS = 2000;

let pollRoomHandle;
let pollRoomsHandle;

/**
 * Send a HTTP request.
 *
 * @param {string} method - HTTP method.
 * @param {string} path - Path and query.
 * @param {Object} json - Payload data, if any.
 */
const request = async (method, path, json) => {
  const { serverUrl } = store.getState();
  const res = await fetch(`http://${serverUrl}:5500${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    ...{ body: json ? JSON.stringify(json): null },
  });

  if (res.status > 400) throw new Error(`Error: ${await res.text()}`)
  return res.json();
};

/**
 * Get a room from the service.
 *
 * @returns {Promise<Object>} Promise resolving to the room response.
 */
const getRoom = async () => {
  const { roomName, playerName } = store.getState();
  if (!roomName && !playerName) return;

  return request('GET', `/rooms/${roomName}?playerName=${playerName}`);
};

/**
 * Get a list of open rooms.
 *
 * @returns {Promise<Object>} Promise resolving to the rooms response.
 */
const getRooms = async () => request('GET', '/rooms');

/**
 * Get a room from the service.
 *
 * @returns {Promise<Object>} Promise resolving to the room response.
 */
const putPlayerInRoom = async () => {
  const { roomName, playerName } = store.getState();

  return request('PUT', `/rooms/${roomName}/player`, { playerName });
};

/**
 * Put a room into inGame state.
 *
 * @returns {Promise<Object>} Promise resolving to the room response.
 */
const putRoomInGame = async () => {
  const { roomName } = store.getState();

  return request('PUT', `/rooms/${roomName}/inGame`);
};

/**
 * Take a square in the name of the player.
 *
 * @param {Object} square - Square taken.
 * @returns {Promise<Object>} Promise resolving to the room response.
 */
const takeSquare = async (square) => {
  const { roomName, playerName } = store.getState();
  const [row, col] = square.key.split(':').map(p => parseInt(p));

  const payload = { playerName, row, col };
  return request('POST', `/rooms/${roomName}/square`, payload);
};

/**
 * Go to the next player's turn.
 *
 * @returns {Promise<Object>} Promise resolving to the room response.
 */
const nextTurn = async () => {
  const { roomName } = store.getState();

  return request('POST', `/rooms/${roomName}/nextTurn`);
};

/**
 * Set the player's color to the next one.
 *
 * @returns {Promise<Object>} Promise resolving to the room response.
 */
const nextPlayerColor = async () => {
  const { roomName, playerName } = store.getState();

  return request('PUT', `/rooms/${roomName}/players/${playerName}/nextColor`);
};

/**
 * Add a new bot to the room.
 *
 * @returns {Promise<Object>} Promise resolving to the room response.
 */
const putBotInRoom = async () => {
  const { roomName } = store.getState();

  return request('PUT', `/rooms/${roomName}/bot`);
};

/**
 * Poll the room state, and by doing so keep the player alive in the server's eyes,
 * and updating the game state.
 */
const pollRoomState = () => {
  pollRoomHandle = setInterval(async () => {
    const { roomState } = store.getState();
    if (!roomState) return;

    const newState = await getRoom();
    store.dispatch(setRoomState(newState));
  }, ROOM_POLL_INTERVAL_MS);
};

/**
 * Stop polling room state.
 */
const stopPollRoomState = () => clearInterval(pollRoomHandle);

/**
 * Poll the list of rooms so players can see when theirs is freed or available.
 */
const pollRooms = () => {
  pollRoomsHandle = setInterval(async () => {
    const { rooms } = await getRooms();
    store.dispatch(setRooms(rooms));
  }, ROOMS_POLL_INTERVAL_MS);
};

/**
 * Stop polling rooms state.
 */
const stopPollRooms = () => clearInterval(pollRoomsHandle);

const apiService = {
  getRooms,
  getRoom,
  putPlayerInRoom,
  putRoomInGame,
  takeSquare,
  nextTurn,
  nextPlayerColor,
  putBotInRoom,
  pollRoomState,
  stopPollRoomState,
  pollRooms,
  stopPollRooms,
};

export default apiService;
