const { getRoomOrRespond, endTurn } = require('../util');

/**
 * Handle POST /room/:roomName/nextTurn requests.
 *
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 */
const handlePostRoomNextTurn = (req, res) => {
  const room = getRoomOrRespond(req, res);
  if (!room) return;

  endTurn(room);

  // Respond with new roomState
  res.status(200).json(room);
};

module.exports = handlePostRoomNextTurn;
