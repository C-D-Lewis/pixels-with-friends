const { rooms } = require('../modules/data');
const { createRoom } = require('../util');

/**
 * Handle GET /room/:roomName requests.
 *
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 */
const handleGetRoom = (req, res) => {
  const { roomName } = req.params;
  const { playerName } = req.query;
  if (!roomName) return res.status(400).json({ error: 'roomName not specified' });

  // If room doesn't exist, create it
  let room = rooms.find(p => p.roomName === roomName);
  if (!room) {
    room = createRoom(roomName);
    rooms.push(room);
    console.log(`Room ${roomName} created`);
  }

  // If a player requested, update the player's lastSeen
  if (playerName) {
    const player = room.players.find(p => p.playerName === playerName);
    if (player) {
      player.lastSeen = Date.now();
    }
  }

  return res.status(200).json(room);
};

module.exports = handleGetRoom;
