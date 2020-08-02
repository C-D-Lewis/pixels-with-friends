const { PlayerColors } = require('../constants');
const { getRoomOrRespond, getPlayerOrRespond } = require('../util');

/**
 * Handle PUT /room/:roomName/players/:playerName/nextColor requests.
 *
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 */
const handlePutRoomPlayerNextColor = (req, res) => {
  const room = getRoomOrRespond(req, res);
  if (!room) return;
  const player = getPlayerOrRespond(req, res);
  if (!player) return;

  const currentColor = PlayerColors.find(p => p.name === player.color);
  const nextIndex = (PlayerColors.indexOf(currentColor) + 1) % PlayerColors.length;
  player.color = PlayerColors[nextIndex].name;

  // Respond with new roomState
  return res.status(200).json(room);
};

module.exports = handlePutRoomPlayerNextColor;
