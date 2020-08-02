const {
  GRID_SIZE,
  SCORE_AMOUNT_SINGLE,
  RUN_LENGTH_MIN,
  DOUBLE_SQUARE_CHANCE,
  BOT_EASY_CHANCE,
  BOT_MEDIUM_CHANCE,
  PlayerColors,
  SquareTypes,
  BotNames,
} = require('./constants');
const { rooms } = require('./modules/data');

/**
 * Get a random integer in a range.
 *
 * @param {number} min - Minimum value.
 * @param {numberr} max - Maximum value to use, inclusive.
 * @returns {number} The random integer.
 */
const randomInt = (min, max) => Math.round(Math.random() * (max - min)) + min;

/**
 * Get a square's value by its type.
 *
 * @param {string} type - SquareTypes value.
 * @returns {number} Score value.
 */
const getSquareValue = (type) => {
  const map = {
    [SquareTypes.Single]: SCORE_AMOUNT_SINGLE,
    [SquareTypes.Double]: 2 * SCORE_AMOUNT_SINGLE,
  };
  return map[type];
};

/**
 * Generate a new grid square data object.
 *
 * @param {number} row - Row of the square.
 * @param {number} col - Column of the square.
 * @returns {Object} The grid square.
 */
const generateGridSquare = (row, col) => ({
  key: `${row}:${col}`,
  playerName: null,
  inShape: false,
  type: SquareTypes.Single,
});

/**
 * Generate a fresh grid.
 *
 * @returns {Object[]} Array of rows.
 */
const generateGrid = () => {
  const newGrid = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    newGrid[row] = [];
    for (let col = 0; col < GRID_SIZE; col++) {
      newGrid[row][col] = generateGridSquare(row, col);

      // Chance of a double square
      if (randomInt(0, 100) < DOUBLE_SQUARE_CHANCE) {
        newGrid[row][col].type = SquareTypes.Double;
      }
    }
  }
  return newGrid;
};

/**
 * Create a player object.
 *
 * @param {string} playerName - Player name as they chose.
 * @param {number} index - Player index.
 * @returns {Object} The player object.
 */
const createPlayer = (playerName, index) => ({
  playerName,
  botData: null,
  score: 0,
  lastSeen: Date.now(),
  color: PlayerColors[index].name,
  index,
  conversions: 0,
  runs: 0,
  bestRunLength: 0,
});

/**
 * Create a Bot player object. Bots are like players, but smarter (tm).
 * Bot levels are 0 - easy, 1 - medium, 2 - hard
 *
 * @param {number} index - Player index.
 * @param {Object} room - Room the bot will play in.
 * @returns {Object} The player object.
 */
const createBot = (index, room) => {
  let botName = BotNames[randomInt(0, BotNames.length - 1)];
  while(room.players.find(p => p.playerName === botName)) {
    botName = BotNames[randomInt(0, BotNames.length - 1)];
  }

  const bot = createPlayer(botName, index);
  bot.botData = {
    level: 0,
    trait: null,
  }
  return bot;
};

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
  currentPlayer: null,
  inGame: false,
  allSquaresFilled: false,
});

/**
 * Helper to get the room. If not found, handle response.
 *
 * @param {Object} req - Request object.
 * @returns {Object} Room if found, false otherwise.
 */
const getRoomOrRespond = (req, res) => {
  const room = rooms.find(p => p.roomName === req.params.roomName);
  if (!room) res.status(404).json({ error: 'Room not found' });

  return room;
};

/**
 * Helper to get the player.
 *
 * @param {Object} req - Request object.
 * @returns {Object} Player if found.
 */
const getPlayerOrRespond = (req, res) => {
  const room = getRoomOrRespond(req, res);
  if (!room) return false;

  const player = room.players.find(p => p.playerName === req.params.playerName);
  if (!player) res.status(404).json({ error: 'Player not found' });

  return player;
};

module.exports = {
  GRID_SIZE,
  PlayerColors,
  randomInt,
  createRoom,
  createPlayer,
  createBot,
  getRoomOrRespond,
  getPlayerOrRespond,
  getSquareValue,
};
