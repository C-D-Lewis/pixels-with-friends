/**
 * roomName reducer.
 *
 * @param {string} roomName - Current room name.
 * @returns {Object} Action object.
 */
export const setRoomName = roomName => ({
  type: 'SET_ROOM_NAME',
  roomName,
});

/**
 * roomState reducer.
 *
 * @param {string} roomState - Current roomState state.
 * @returns {Object} Action object.
 */
export const setRoomState = roomState => ({
  type: 'SET_ROOM_STATE',
  roomState,
});

/**
 * playerName reducer.
 *
 * @param {string} playerName - Current playerName state.
 * @returns {Object} Action object.
 */
export const setPlayerName = playerName => ({
  type: 'SET_PLAYER_NAME',
  playerName,
});

/**
 * page reducer.
 *
 * @param {string} page - Current page state.
 * @returns {Object} Action object.
 */
export const setPage = page => ({
  type: 'SET_PAGE',
  page,
});
