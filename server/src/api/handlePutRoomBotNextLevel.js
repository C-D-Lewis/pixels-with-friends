const { NUM_BOT_LEVELS } = require('../constants');
const { getRoomOrRespond, getPlayerOrRespond } = require('../util');

/**
 * Handle PUT /room/:roomName/bot/:playerName/nextLevel requests.
 *
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 */
const handlePutRoomBotNextLevel = (req, res) => {
  const room = getRoomOrRespond(req, res);
  if (!room) return;
  const bot = getPlayerOrRespond(req, res);
  if (!bot) return;

  // Cycles 1, 2, 3, 1, 2, 3...
  bot.botData.level = (bot.botData.level + 1) % NUM_BOT_LEVELS;

  return res.status(200).json(room);
};

module.exports = handlePutRoomBotNextLevel;
