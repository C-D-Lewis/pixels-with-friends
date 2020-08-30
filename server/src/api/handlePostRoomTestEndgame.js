const { GRID_SIZE } = require('../constants');
const { getRoomOrRespond, randomInt } = require('../util');

/**
 * Handle POST /room/:roomName/testEndGame requests.
 *
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 */
const handlePostRoomTestEndgame = (req, res) => {
  const room = getRoomOrRespond(req, res);
  if (!room) return;

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const playerIndex = randomInt(0, room.players.length - 1);
      const player = room.players[playerIndex];
      room.grid[row][col].playerName = player.playerName;
      room.grid[row][col].color = player.color;
    }
  }

  // Don't complete right away
  room.grid[1][0].playerName = null;

  // Respond with new roomState
  return res.status(200).json(room);
};

module.exports = handlePostRoomTestEndgame;
