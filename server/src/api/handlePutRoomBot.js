const { getRoomOrRespond, createBot } = require('../util');

/**
 * Handle PUT /room/:roomName/bot requests.
 *
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 */
const handlePutRoomBot = (req, res) => {
  const room = getRoomOrRespond(req, res);
  if (!room) return;

  // Insert a player, type bot. Assign random friendly name and color.
  const nextIndex = room.players.length;
  const bot = createBot(nextIndex, room);
  console.log(`Bot ${bot.playerName} joined ${room.roomName}`);

  room.players.push(bot);
  return res.status(200).json(room);
};

module.exports = handlePutRoomBot;
