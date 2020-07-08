/** API root */
const API = 'http://localhost:5500';

/**
 * Get a room from the service.
 *
 * @param {string} roomName - Room name.
 * @returns {Promise<Object>} Promise resolving to the room response.
 */
const getRoom = async (roomName) => {
  const res = await fetch(`${API}/rooms/${roomName}`);
  return await res.json();
};

/**
 * Get a room from the service.
 *
 * @param {string} roomName - Room name.
 * @param {string} playerName - Player name.
 * @returns {Promise<Object>} Promise resolving to the room response.
 */
const putPlayerInRoom = async (roomName, playerName) => {
  const res = await fetch(`${API}/rooms/${roomName}/player`, {
    headers: { 'Content-Type': 'application/json' },
    method: 'put',
    body: JSON.stringify({ playerName }),
  });
  return await res.json();
};

const apiService = {
  getRoom,
  putPlayerInRoom,
};

export default apiService;
