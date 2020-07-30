/** Size of the grid */
const GRID_SIZE = 9;
/** Basic score for a single square */
const SCORE_AMOUNT_SINGLE = 10;
/** Minimum run length */
const RUN_COUNT_MIN = 4;
/** Chance a square is a double square */
const DOUBLE_SQUARE_CHANCE = 10;

/** Player colors - must sync */
const PlayerColors = [
  { name: 'blue',   light: '#2196F3', dark: '#1976D2' },
  { name: 'red',    light: '#F44336', dark: '#D32F2F' },
  { name: 'green',  light: '#4CAF50', dark: '#388E3C' },
  { name: 'yellow', light: '#FFEB3B', dark: '#FBC02D' },
  { name: 'purple', light: '#9C27B0', dark: '#7B1FA2' },
  { name: 'pink',   light: '#F06292', dark: '#EC407A' },
  { name: 'orange', light: '#FF9800', dark: '#F57C00' },
  { name: 'cyan',   light: '#00BCD4', dark: '#0097A7' },
];

/** Special square types - must sync */
const SquareTypes = {
  Single: 'single',
  Double: 'double',
};

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
  type: SquareTypes.Single,  // TODO Randomise double tiles, other tyles...
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
 * @param {number} botLevel - Specified if a player is bot. Levels are 0 - 2 for easy, medium, hard.
 * @returns {Object} The player object.
 */
const createPlayer = (playerName, index, botLevel) => ({
  playerName,
  botLevel,
  score: 0,
  lastSeen: Date.now(),
  color: PlayerColors[index].name,
  index,
  conversions: 0,
  runs: 0,
  bestRunLength: 0,
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
  currentPlayer: null,
  inGame: false,
  allSquaresFilled: false,
});

/**
 * Check a position is in the grid.
 *
 * @param {number} x - X coorindate.
 * @param {number} y - Y coorindate.
 * @returns {boolean}
 */
const isInGrid = (x, y) => x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE;

/**
 * Get a random integer in a range.
 *
 * @param {number} min - Minimum value.
 * @param {numberr} max - Maximum value to use.
 * @returns {number} The random integer.
 */
const randomInt = (min, max) => Math.round(Math.random() * (max - min)) + min;

/**
 * Find instances where a player has surrounded another player's squares.
 *
 * @param {Object} room - Room to search.
 */
const findSurroundedSquares = (room) => {
  const { grid, players } = room;

  for (let y = 1; y < GRID_SIZE - 1; y++) {
    for (let x = 1; x < GRID_SIZE - 1; x++) {
      const owner = grid[y][x].playerName;
      if (!owner) continue;

      const nOwner = grid[y - 1][x].playerName && grid[y - 1][x].playerName;
      const sOwner = grid[y + 1][x].playerName && grid[y + 1][x].playerName;
      const eOwner = grid[y][x + 1].playerName && grid[y][x + 1].playerName;
      const wOwner = grid[y][x - 1].playerName && grid[y][x - 1].playerName;

      // If all cardinal owners are the same, and not the owner
      const neighbors = [nOwner, sOwner, eOwner, wOwner];
      if (!nOwner || !neighbors.every(p => p === nOwner) || nOwner === owner) continue;

      // Surrounding player takes over
      console.log(`Player ${nOwner} claimed square ${x}:${y} from ${owner}`);
      grid[y][x].playerName = nOwner;
      const nOwnerPlayer = players.find(p => p.playerName === nOwner);
      nOwnerPlayer.score += 5 * getSquareValue(grid[y][x].type);
      nOwnerPlayer.conversions++;
    }
  }
};

/**
 * Find a run on the grid using movement deltas to govern direction.
 *
 * @param {Array[]} grid - List of grid rows.
 * @param {Object[]} players - List of players.
 * @param {string} owner - Owner of the run start.
 * @param {number} y - Starting Y coorindate.
 * @param {number} x - Starting X coorindate.
 * @param {number} dy - Y delta.
 * @param {number} dx - X delta.
 */
const findRun = (grid, players, owner, y, x, dy, dx) => {
  const runLocations = [];
  let j = y; i = x;

  // Find run length
  while (isInGrid(i, j) && grid[j][i].playerName && grid[j][i].playerName === owner && !grid[j][i].inShape) {
    runLocations.push([j, i]);
    j += dy;
    i += dx;
  }

  const runLength = runLocations.length;
  if (runLength < RUN_COUNT_MIN) return;

  // Award points for each tile's value
  const ownerPlayer = players.find(p => p.playerName === owner);
  runLocations.forEach(([b, a]) => {
    grid[b][a].inShape = true;
    ownerPlayer.score += getSquareValue(grid[b][a].type);
  });
  ownerPlayer.runs++;
  if (runLength > ownerPlayer.bestRunLength) {
    ownerPlayer.bestRunLength = runLength;
  }
};

/**
 * Find sets of 4 or more and mark as a shape to they won't be redeemed again
 *
 * @param {Object} room - Room to search.
 */
const findRuns = (room) => {
  const { grid, players } = room;

  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const owner = grid[y][x].playerName;
      if (!owner) continue;

      // North, south, east, west
      findRun(grid, players, owner, y, x, -1, 0);
      findRun(grid, players, owner, y, x, 1, 0);
      findRun(grid, players, owner, y, x, 0, 1);
      findRun(grid, players, owner, y, x, 0, 1);
    }
  }
};

module.exports = {
  GRID_SIZE,
  PlayerColors,
  randomInt,
  createRoom,
  createPlayer,
  findSurroundedSquares,
  findRuns,
  getSquareValue,
};
