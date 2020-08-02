const { MAX_PLAYERS } = require('../constants');
const { createPlayer, getRoomOrRespond } = require('../util');

/**
 * Handle PUT /room/:roomName/player requests.
 *
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 */
const handlePutRoomPlayer = (req, res) => {
  const room = getRoomOrRespond(req, res);
  if (!room) return;
  if (room.players.length === MAX_PLAYERS) return res.status(409).json({ error: 'Room is full' });

  const { playerName } = req.body;
  let player = room.players.find(p => p.playerName === playerName);
  if (player) return res.status(409).json({ error: 'Player already in the room' });

  const nextIndex = room.players.length;
  player = createPlayer(playerName, nextIndex);
  console.log(`Player ${playerName} joined ${room.roomName}`);

  // Mark the host, who must stay for the length of the game
  if (nextIndex === 0) {
    player.isHost = true;
    room.currentPlayer = player.playerName;
  }

  room.players.push(player);
  return res.status(200).json(room);
};

module.exports = handlePutRoomPlayer;
