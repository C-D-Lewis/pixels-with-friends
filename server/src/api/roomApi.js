const { omit } = require('lodash');

/** Size of the grid */
const GRID_SIZE = 9;
/** Max players */
const MAX_PLAYERS = 8;

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
});

/**
 * Handle GET /room/:roomName requests.
 *
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 */
const handleGetRoom = (req, res) => {
  const { roomName } = req.params;
  if (!roomName) return res.status(400).json({ error: 'Name not specified' });

  // If a room exists, return its state
  const existing = rooms.find(p => p.roomName === roomName);
  if (existing) return res.status(200).json(omit(existing, 'grid'));

  // If not, create it and return its state
  const newRoom = createRoom(roomName);
  rooms.push(newRoom);
  return res.status(200).json(omit(newRoom, 'grid'));
};

/**
 * Handle GET /room/:roomName/grid requests.
 *
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 */
const handleGetRoomGrid = (req, res) => {
  const { roomName } = req.params;
  if (!roomName) return res.status(400).json({ error: 'Name not specified' });

  // If a room exists, return its state
  const existing = rooms.find(p => p.roomName === roomName);
  if (!existing) return res.status(404).json({ error: 'Not Found' });

  return res.status(200).json(existing.grid);
};

/**
 * Handle PUT /room/:roomName/player requests.
 *
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 */
const handlePutRoomPlayer = (req, res) => {
  const { roomName } = req.params;
  if (!roomName) return res.status(400).json({ error: 'Name not specified' });

  // If a room exists, return its state
  const existingRoom = rooms.find(p => p.roomName === roomName);
  if (!existingRoom) return res.status(404).json({ error: 'Not Found' });

  // If a room is full, don't add them
  if (existingRoom.players.length === MAX_PLAYERS) return res.status(409).json({ error: 'Room is full' });

  const { playerName } = req.body;
  if (!playerName) return res.status(400).json({ error: 'playerName not specified' });

  // Player already exists?
  // FIXME: Remove a player when they close the game to prevent ghosts
  const existingPlayer = existingRoom.players.find(p => p.playerName === playerName);
  if (existingPlayer) return res.status(200).json(omit(existingRoom, 'grid'));

  const newPlayer = createPlayer(playerName);
  existingRoom.players.push(newPlayer);
  return res.status(200).json(omit(existingRoom, 'grid'));
};

module.exports = {
  handleGetRoom,
  handleGetRoomGrid,
  handlePutRoomPlayer,
};

// FIXME: Expire rooms when they are done with/empty
