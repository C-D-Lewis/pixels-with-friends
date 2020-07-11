/** Size of the grid */
const GRID_SIZE = 9;
/** Basic score for a single square */
const SCORE_AMOUNT_SINGLE = 10;

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
 * Find instances where a player has surrounded another player's squares.
 *
 * @param {Object} existingRoom - Room to search.
 */
const findSurroundedSquares = (existingRoom) => {
  const { grid, players } = existingRoom;

  for (let y = 1; y < GRID_SIZE - 1; y++) {
    for (let x = 1; x < GRID_SIZE - 1; x++) {
      const centerOwner = grid[y][x].playerName;
      if (!centerOwner) continue;

      const nOwner = grid[y - 1][x].playerName && grid[y - 1][x].playerName;
      const sOwner = grid[y + 1][x].playerName && grid[y + 1][x].playerName;
      const eOwner = grid[y][x + 1].playerName && grid[y][x + 1].playerName;
      const wOwner = grid[y][x - 1].playerName && grid[y][x - 1].playerName;

      // If all cardinal owners are the same, and not the centerOwner
      const neighbors = [nOwner, sOwner, eOwner, wOwner];
      if (!!nOwner && neighbors.every(p => p === nOwner) && nOwner !== centerOwner) {
        // Surrounding player takes over
        const newOwnerName = grid[y - 1][x].playerName;
        console.log(`Player ${newOwnerName} claimed tile ${x}:${y} from ${centerOwner}`);
        grid[y][x].playerName = newOwnerName;

        const newOwnerPlayer = players.find(p => p.playerName === newOwnerName);
        newOwnerPlayer.score += 5 * SCORE_AMOUNT_SINGLE;
      }
    }
  }
};

module.exports = {
  GRID_SIZE,
  createRoom,
  createPlayer,
  findSurroundedSquares,
  SCORE_AMOUNT_SINGLE,
};
