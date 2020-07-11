/** Size of the grid */
const GRID_SIZE = 9;
/** Basic score for a single square */
const SCORE_AMOUNT_SINGLE = 10;
/** Minimum run length */
const RUN_COUNT_MIN = 4;

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
      console.log(`Player ${nOwner} claimed tile ${x}:${y} from ${owner}`);
      grid[y][x].playerName = nOwner;
      const nOwnerPlayer = players.find(p => p.playerName === nOwner);
      nOwnerPlayer.score += 5 * SCORE_AMOUNT_SINGLE;
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

  // Award points
  if (runLocations.length < RUN_COUNT_MIN) return;
  const ownerPlayer = players.find(p => p.playerName === owner);
  ownerPlayer.score += runLocations.length * SCORE_AMOUNT_SINGLE;
  runLocations.forEach(([a, b]) => {
    grid[a][b].inShape = true;
  });
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
  SCORE_AMOUNT_SINGLE,
  createRoom,
  createPlayer,
  findSurroundedSquares,
  findRuns,
};
