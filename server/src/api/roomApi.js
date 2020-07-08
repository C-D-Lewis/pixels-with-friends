const { omit } = require('lodash');

/** Size of the grid */
const GRID_SIZE = 9;
/** Max players */
const MAX_PLAYERS = 8;
/** Interval between lastSeen checks. */
const PLAYER_LAST_SEEN_INTERVAL_MS = 5000;
/** Max time after which a player is deemed MIA */
const PLAYER_LAST_SEEN_MAX_MS = 15000;

// All games stored only in memory - they are short lived
const rooms = [];

/**
 * Generate a new grid square data object.
 *
 * @param {number} row - Row of the square.
 * @param {number} col - Column of the square.
 * @returns {Object} The grid square.
 */
const generateGridSquare = (row, col) => ({
  key: `${row}:${col}`,
  player: null,
  row,
  col,
});

/**
 * Generate a fresh grid.
 *
 * @returns {Object[]} Array of rows.
 */
const generateGrid = () => {
  const result = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    result[row] = [];
    for (let col = 0; col < GRID_SIZE; col++) {
      result[row][col] = generateGridSquare(row, col);
    }
  }
  return result;
};

/**
 * Create a player object.
 *
 * @param {string} playerName - Player name as they chose.
 * @returns {Object} The player object.
 */
const createPlayer = (playerName) => ({
  playerName,
  score: 0,
  lastSeen: Date.now(),
});

/**
 * Create a room object.
 *
 * @param {string} rooomName - Room name as they chose.
 * @returns {Object} The room object.
 */
const createRoom = (roomName) => ({
  roomName,
  players: [],
  grid: generateGrid(),
  currentPlayer: 0,
  inGame: false,
});

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

  return res.status(200).json(omit(existingRoom, 'grid'));
};

/**
 * Handle GET /room/:roomName/grid requests.
 *
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 */
const handleGetRoomGrid = (req, res) => {
  const { roomName } = req.params;
  if (!roomName) return res.status(400).json({ error: 'roomName not specified' });
  const existingRoom = rooms.find(p => p.roomName === roomName);
  if (!existingRoom) return res.status(404).json({ error: 'Room not found' });

  return res.status(200).json(existingRoom.grid);
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
  // FIXME: Remove a player when they close the game to prevent ghosts
  const existingPlayer = existingRoom.players.find(p => p.playerName === playerName);
  if (existingPlayer) return res.status(409).json({ error: 'Player already in the room' });

  const newPlayer = createPlayer(playerName);
  existingRoom.players.push(newPlayer);
  return res.status(200).json(omit(existingRoom, 'grid'));
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
  existingRoom.inGame = true;
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
        const diff = now - player.lastSeen;
        if (diff < PLAYER_LAST_SEEN_MAX_MS) return;

        console.log(`Removing player ${player.playerName} from ${room.roomName} after ${diff / 1000}s`);
        room.players.splice(room.players.indexOf(player), 1);
      });
    });
  }, PLAYER_LAST_SEEN_INTERVAL_MS);
}

module.exports = {
  handleGetRoom,
  handleGetRoomGrid,
  handlePutRoomPlayer,
  handlePutRoomInGame,
  monitorPlayerLastSeen,
};

// FIXME: Expire rooms when they are done with/empty
