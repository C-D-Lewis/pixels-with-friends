/** Size of the grid */
const GRID_SIZE = 9;
/** Basic score for a single square */
const SCORE_AMOUNT_SINGLE = 10;
/** Minimum run length */
const RUN_COUNT_MIN = 4;
/** Chance a square is a double square */
const DOUBLE_SQUARE_CHANCE = 10;
/** Change to place defensively as an easy bot */
const BOT_EASY_DEFENSIVE_CHANCE = 40;

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

/** Bot names */
const BotNames = [
  'Buttons',
  'Curious',
  'Tinker',
  'Twobit',
  'Core',
  'Scrap',
  'Spark',
  'Socket',
];

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
 * Bot levels are 1 - easy, 2 - medium, 3 - hard
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
    level: 1,
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
 * @param {string} owner - Owner of the run start.
 * @param {number} y - Starting Y coorindate.
 * @param {number} x - Starting X coorindate.
 * @param {number} dy - Y delta.
 * @param {number} dx - X delta.
 * @returns {Object[]} List of run grid locations.
 */
const findRunLocations = (grid, owner, y, x, dy, dx) => {
  const runLocations = [];
  let j = y; i = x;

  // Find run length
  while (isInGrid(i, j) && grid[j][i].playerName && grid[j][i].playerName === owner && !grid[j][i].inShape) {
    runLocations.push([j, i]);
    j += dy;
    i += dx;
  }

  return (runLocations.length < RUN_COUNT_MIN)
    ? null
    : runLocations;
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

      // Try all of north, south, east, west until a run is found
      let runLocations = findRunLocations(grid, owner, y, x, -1, 0);
      if (!runLocations) {
        runLocations = findRunLocations(grid, owner, y, x, 1, 0);
      }
      if (!runLocations) {
        runLocations = findRunLocations(grid, owner, y, x, 0, 1);
      }
      if (!runLocations) {
        runLocations = findRunLocations(grid, owner, y, x, 0, 1);
      }

      if (runLocations) {
        // Award points for each tile's value
        const ownerPlayer = players.find(p => p.playerName === owner);
        runLocations.forEach(([b, a]) => {
          grid[b][a].inShape = true;
          ownerPlayer.score += getSquareValue(grid[b][a].type);
        });

        // Remember stats
        ownerPlayer.runs++;
        if (runLocations.length > ownerPlayer.bestRunLength) {
          ownerPlayer.bestRunLength = runLocations.length;
        }
      }
    }
  }
};

/**
 * Find a random unoccupied square.
 *
 * @param {Object[]} grid - Room's grid of squares.
 * @returns {Object} { x, y } The random move to use.
 */
const findRandomMove = (grid) => {
  let move = { x: randomInt(0, GRID_SIZE - 1), y: randomInt(0, GRID_SIZE - 1) };
  while (grid[move.y][move.x].playerName) {
    move = { x: randomInt(0, GRID_SIZE - 1), y: randomInt(0, GRID_SIZE - 1) };
  }
  return move;
};

/**
 * Find a defensive move, either:
 * - Capping off a run in progres (<4)
 * - Preventing a capture in progress (not all four sides)
 *
 * @param {Object} grid - Room grid to use.
 * @param {Object} bot - Bot player taking their turn.
 * @returns {Object} { x, y } The defensive move to use.
 */
const findDefensiveMove = (grid, bot) => {
  return findRandomMove(grid);
}

/**
 * Emulate a bot thinking, then taking their turn.
 *
 * @param {Object[]} room - Room to use.
 * @param {Object} bot - Bot player taking their turn.
 */
const emulateBotMove = (room, bot) => {
  const { level } = bot.botData;
  const { grid } = room;

  // Do something different based on lavel
  let move;
  switch (level) {
    // Easy
    case 1:
      console.log(`Bot ${bot.playerName} is taking it easy`);

      // Chance to play a defensive move
      move = (randomInt(0, 100) > BOT_EASY_DEFENSIVE_CHANCE)
        ? findDefensiveMove(grid, bot)
        : findRandomMove(grid);
      break;
    // Medium - Always plays defensively (preventing runs, captures)
    case 2:
      console.log(`Bot ${bot.playerName} is practicing for the big leagues`);
    // Hard - always takes an aggressive move (make runs, captures)
    case 3:
      console.log(`Bot ${bot.playerName} is taking no prisoners!`);
    default:
      console.log(`Bot ${bot.playerName} has no idea what they're doing`);
      move = findRandomMove(grid);
      break;
  }

  // Apply the move
  grid[move.y][move.x].playerName = bot.playerName;
  bot.score += getSquareValue(grid[move.y][move.x].type);

  // Next turn
  goToNextPlayer(room);
};

/**
 * Advance to the next player.
 *
 * @param {Object} room - Current room.
 */
const goToNextPlayer = (room) => {
  const { players } = room;

  // Find the next player in the list
  const currentPlayer = players.find(p => p.playerName === room.currentPlayer);
  const nextIndex = (players.indexOf(currentPlayer) + 1) % players.length;
  room.currentPlayer = players[nextIndex].playerName;

  // If next player is a bot, emulate thinking time, then take a turn
  const nextPlayer = players.find(p => p.playerName === room.currentPlayer);
  if (!nextPlayer.botData) return;

  console.log(`Bot ${room.currentPlayer} is thinking of a move...`);
  setTimeout(() => emulateBotMove(room, nextPlayer), randomInt(1000, 5000));
};

module.exports = {
  GRID_SIZE,
  PlayerColors,
  randomInt,
  createRoom,
  createPlayer,
  createBot,
  findSurroundedSquares,
  findRuns,
  getSquareValue,
  emulateBotMove,
  goToNextPlayer,
};
