const { getRoomOrRespond, getSquareValue, endTurn } = require('../util');

/**
 * Handle POST /room/:roomName/square requests.
 *
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 */
const handlePostRoomSquare = (req, res) => {
  const { playerName, row, col } = req.body;

  const room = getRoomOrRespond(req, res);
  if (!room) return;
  const player = room.players.find(p => p.playerName === playerName);
  if (!player) return res.status(404).json({ error: 'Player not found' });

  // Set ownership and aware points - client validates it is a free square
  const { grid, players } = room;
  grid[row][col].playerName = playerName;
  player.score += getSquareValue(grid[row][col].type);
  console.log(`Player ${playerName} placed at ${col}:${row}`);

  // Next player's turn - has to be done by name in case players drop out
  endTurn(room);

  // Respond with new roomState
  return res.status(200).json(room);
};

module.exports = handlePostRoomSquare;
