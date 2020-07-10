const { GRID_SIZE, createRoom, createPlayer } = require('../util');

/** Max players */
const MAX_PLAYERS = 8;
/** Interval between lastSeen checks. */
const PLAYER_LAST_SEEN_INTERVAL_MS = 5000;
/** Max time after which a player is deemed MIA */
const PLAYER_LAST_SEEN_MAX_MS = 10000;
/** Basic score for a single square */
const SCORE_AMOUNT_SINGLE = 10;

// All games stored only in memory - they are short lived
const rooms = [];

/**
 * Handle GET /room/:roomName requests.
 *
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 */
const handleGetRoom = (req, res) => {
  const { roomName } = req.params;
  if (!roomName) return res.status(400).json({ error: 'roomName not specified' });

  // If room doesn't exist, create it
  let existingRoom = rooms.find(p => p.roomName === roomName);
  if (!existingRoom) {
    console.log(`Room ${roomName} created`);
    existingRoom = createRoom(roomName);
    rooms.push(existingRoom);
  }

  // If a player requested, update the player's lastSeen
  const { playerName } = req.query;
  if (playerName) {
    const existingPlayer = existingRoom.players.find(p => p.playerName === playerName);
    if (existingPlayer) {
      existingPlayer.lastSeen = Date.now();
    }
  }

  return res.status(200).json(existingRoom);
};

/**
 * Handle PUT /room/:roomName/player requests.
 *
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 */
const handlePutRoomPlayer = (req, res) => {
  const { roomName } = req.params;
  if (!roomName) return res.status(400).json({ error: 'roomName not specified' });
  const existingRoom = rooms.find(p => p.roomName === roomName);
  if (!existingRoom) return res.status(404).json({ error: 'Room not found' });

  // If a room is full, don't add them
  if (existingRoom.players.length === MAX_PLAYERS) return res.status(409).json({ error: 'Room is full' });

  const { playerName } = req.body;
  if (!playerName) return res.status(400).json({ error: 'playerName not specified' });

  // Player already exists?
  const existingPlayer = existingRoom.players.find(p => p.playerName === playerName);
  if (existingPlayer) return res.status(409).json({ error: 'Player already in the room' });

  const newPlayer = createPlayer(playerName);
  console.log(`Player ${playerName} joined ${roomName}`);

  // Mark the host, who must stay for the length of the game
  // The first player will also take the first move
  if (existingRoom.players.length === 0) {
    newPlayer.isHost = true;
    existingRoom.currentPlayer = newPlayer.playerName;
  }

  existingRoom.players.push(newPlayer);
  return res.status(200).json(existingRoom);
};

/**
 * Handle PUT /room/:roomName/inLobby requests.
 *
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 */
const handlePutRoomInGame = (req, res) => {
  const { roomName } = req.params;
  if (!roomName) return res.status(400).json({ error: 'roomName not specified' });
  const existingRoom = rooms.find(p => p.roomName === roomName);
  if (!existingRoom) return res.status(404).json({ error: 'Room not found' });

  // Set the game as in progress, clients poll for this
  console.log(`Room ${roomName} is now in game`);
  existingRoom.inGame = true;
  return res.status(200).json(existingRoom);
};

/**
 * Find instances where a player has surrounded another player's tiles.
 *
 * @param {Object} existingRoom - Room to search.
 */
const findSurroundedTiles = (existingRoom) => {
  const { grid, players } = existingRoom;

  for (let y = 1; y < GRID_SIZE - 2; y++) {
    for (let x = 1; x < GRID_SIZE - 2; x++) {
      const centerOwner = grid[y][x].playerName;
      if (
        grid[y - 1][x].playerName && grid[y - 1][x].playerName !== centerOwner &&
        grid[y + 1][x].playerName && grid[y + 1][x].playerName !== centerOwner &&
        grid[y][x + 1].playerName && grid[y][x + 1].playerName !== centerOwner &&
        grid[y][x - 1].playerName && grid[y][x - 1].playerName !== centerOwner
      ) {
        // Surrounding player takes over
        const newOwnerName = grid[y - 1][x].playerName;
        console.log(`Player ${newOwnerName} claimed tile ${x}:${y} from ${centerOwner}`);
        grid[y][x].playerName = newOwnerName;

        const newOwnerPlayer = players.find(p => p.playerName === newOwnerName);
        newOwnerPlayer.score += 5 * SCORE_AMOUNT_SINGLE;
      }
    }
  }
}

/**
 * Handle POST /room/:roomName/square requests.
 *
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 */
const handlePostRoomSquare = (req, res) => {
  const { roomName } = req.params;
  if (!roomName) return res.status(400).json({ error: 'roomName not specified' });
  const existingRoom = rooms.find(p => p.roomName === roomName);
  if (!existingRoom) return res.status(404).json({ error: 'Room not found' });

  const { playerName, row, col } = req.body;
  if (row === undefined || col === undefined || !playerName) {
    return res.status(400).json({ error: 'row, col, or playerName not specified' });
  }

  const existingPlayer = existingRoom.players.find(p => p.playerName === playerName);
  if (!existingPlayer) return res.status(404).json({ error: 'Player not found' });

  // Set ownership - client validates it is free
  console.log(`Player ${playerName} placed at ${col}:${row}`);
  existingRoom.grid[row][col].playerName = playerName;

  // Calculate points to award - TODO Magic shapes award more points
  existingPlayer.score += SCORE_AMOUNT_SINGLE;

  // Find tiles surrounded for conversion
  findSurroundedTiles(existingRoom);

  // Next player's turn - has to be done by name in case players drop out
  let currentPlayerIndex = existingRoom.players.indexOf(existingPlayer);
  currentPlayerIndex += 1;
  currentPlayerIndex %= existingRoom.players.length;
  existingRoom.currentPlayer = existingRoom.players[currentPlayerIndex].playerName;

  // Respond with new roomState
  return res.status(200).json(existingRoom);
};

/**
 * Monitor players for their pings and remove those not seen for a while.
 */
const monitorPlayerLastSeen = () => {
  setInterval(() => {
    const now = Date.now();
    rooms.forEach((room) => {
      room.players.forEach((player) => {
        // Players who didn't query roomState for a while get removed
        const diff = now - player.lastSeen;
        if (diff < PLAYER_LAST_SEEN_MAX_MS) return;

        console.log(`Removing player ${player.playerName} from ${room.roomName} after ${diff / 1000}s`);
        room.players.splice(room.players.indexOf(player), 1);
      });

      // If the room now has no players, free it up
      if (room.players.length === 0) {
        console.log(`Removing empty room ${room.roomName}`);
        rooms.splice(rooms.indexOf(room), 1);
      }
    });
  }, PLAYER_LAST_SEEN_INTERVAL_MS);
}

module.exports = {
  handleGetRoom,
  handlePutRoomPlayer,
  handlePutRoomInGame,
  handlePostRoomSquare,
  monitorPlayerLastSeen,
};

// FIXME: Expire rooms when they are done with/empty
