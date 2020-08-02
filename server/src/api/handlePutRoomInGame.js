const { getRoomOrRespond } = require('../util');

/**
 * Handle PUT /room/:roomName/inLobby requests.
 *
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 */
const handlePutRoomInGame = (req, res) => {
  const room = getRoomOrRespond(req, res);
  if (!room) return;

  // Set the game as in progress, clients poll for this
  room.inGame = true;
  console.log(`Room ${room.roomName} is now in game`);
  return res.status(200).json(room);
};

module.exports = handlePutRoomInGame;
