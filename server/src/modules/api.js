const { PLAYER_LAST_SEEN_MAX_MS } = require('../constants');
const { endTurn } = require('./logic');

/**
 * Update all rooms, handling dead players.
 */
const removeDeadPlayers = () => {
  const rooms = await 
  rooms.forEach((room) => {
    // If the room now has no human players, free it up
    if (room.players.length === 0 || room.players.every(p => p.botData)) {
      console.log(`Removing empty room ${room.roomName}`);
      room.isDead = true;
      rooms.splice(rooms.indexOf(room), 1);
      return;
    }

    // Time out players who have closed the game
    room.players.forEach((player, index) => {
      // Bots don't leave until all humans have
      if (player.botData) return;

      // Players who didn't query roomState for a while get removed
      const now = Date.now();
      const diff = now - player.lastSeen;
      if (diff < PLAYER_LAST_SEEN_MAX_MS) return;

      console.log(`Removing player ${player.playerName} from ${room.roomName} after ${diff / 1000}s`);
      room.players.splice(room.players.indexOf(player), 1);

      // If the player taking a turn leaves, move on to the next player
      if (room.currentPlayer === player.playerName) endTurn(room);
    });
  });
};

module.exports = {
  removeDeadPlayers,
};
