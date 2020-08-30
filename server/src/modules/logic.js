const {
  GRID_SIZE,
  RUN_LENGTH_MIN,
  BOT_EASY_CHANCE,
  BOT_MEDIUM_CHANCE,
} = require('../constants');
const { getSquareValue, randomInt } = require('../util');

/**
 * Check a position is in the grid.
 *
 * @param {number} x - X coorindate.
 * @param {number} y - Y coorindate.
 * @returns {boolean}
 */
const isInGrid = (x, y) => x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE;

/**
 * Find a run on the grid using movement deltas to govern direction.
 *
 * @param {Array[]} grid - List of grid rows.
 * @param {string} color - Color of the run start.
 * @param {number} y - Starting Y coorindate.
 * @param {number} x - Starting X coorindate.
 * @param {number} dy - Y delta.
 * @param {number} dx - X delta.
 * @param {number} minLength - Minimum length to count.
 * @returns {Object} List of run grid locations, along with specified directions.
 */
const findRun = (grid, color, y, x, dy, dx, minLength) => {
  const locations = [];
  let j = y; i = x;

  // Find run on the grid, with a color that matches the origin color, not in a shape
  while (
    isInGrid(i, j) &&
    grid[j][i].playerName &&
    grid[j][i].color === color &&
    !grid[j][i].inShape
  ) {
    locations.push([j, i]);
    j += dy;
    i += dx;
  }

  // Must reach minLength to be valid
  return (locations.length < minLength)
    ? null
    : { x, y, locations, dx, dy };
};

/**
 * Find a run on the grid of a given length, from a given start position.
 *
 * @param {Array[]} grid - List of grid rows.
 * @param {number} minLength - Minimum length to count.
 * @param {string} [findColor] - Optional color to search for.
 * @param {number} [startX] - Start x coordindate to search from. Used +1 to avoid repeats.
 * @param {number} [startY] - Start y coordindate to search from.
 * @returns {Object} List of run grid locations, along with specified directions.
 */
const findRunOfLength = (grid, minLength, findColor, startX, startY) => {
  for (let y = startY || 0; y < GRID_SIZE; y++) {
    for (let x = (startX + 1) || 0; x < GRID_SIZE; x++) {
      const color = grid[y][x].color;
      if (!color) continue;
      if (findColor && color !== findColor) continue;

      // Try all of north, south, east, west until a run is found
      const foundRun = findRun(grid, color, y, x, -1, 0, minLength)
        || findRun(grid, color, y, x, 1, 0, minLength)
        || findRun(grid, color, y, x, 0, 1, minLength)
        || findRun(grid, color, y, x, 0, 1, minLength);

      if (foundRun) return foundRun;
    }
  }
};

/**
 * Find a run cap of specified length and optional owner.
 *
 * @param {Object[]} grid - Room's grid of squares.
 * @param {Object} bot - Bot player taking their turn.
 * @param {number} minLength - Minimum run length to find.
 * @param {string} [color] - Optional run color to search for.
 * @returns {Object} { x, y } The random move to use.
 */
const findRunCap = (grid, bot, minLength, color) => {
  let foundRun = findRunOfLength(grid, minLength, color);
  while (foundRun) {
    const { x, y, dx, dy } = foundRun;
    console.log(`Bot ${bot.playerName} sees opportunity at ${x}:${y}`);

    // Move is the next in the run sequence, but could be owned already
    let runCap = { x: x + (minLength * dx), y: y + (minLength * dy) };
    if (isInGrid(runCap.x, runCap.y) && !grid[runCap.y][runCap.x].playerName) return runCap;

    // Try the other end
    runCap = { x: x - dx, y: y - dy };
    if (isInGrid(runCap.x, runCap.y) && !grid[runCap.y][runCap.x].playerName) return runCap;

    console.log(`Bot ${bot.playerName} would totally have used that run`);
    foundRun = findRunOfLength(grid, minLength, color, x, y);
  }
};

/**
 * Find a square poised to be captured, but not yet changed.
 *
 * @param {Object[]} grid - Room's grid of squares.
 * @returns {Object} Data about the capture, else undefined.
 */
const findCapturedSquare = (grid) => {
  for (let y = 1; y < GRID_SIZE - 1; y++) {
    for (let x = 1; x < GRID_SIZE - 1; x++) {
      const ownerColor = grid[y][x].color;
      if (!ownerColor) continue;

      const nColor = grid[y - 1][x].color;
      const sColor = grid[y + 1][x].color;
      const eColor = grid[y][x + 1].color;
      const wColor = grid[y][x - 1].color;
      const neighbors = [nColor, sColor, eColor, wColor];

      // If all cardinal owners are the same, and not the owner, it's captured
      if (!nColor || !neighbors.every(p => p === nColor) || nColor === ownerColor) continue;

      return { nColor, x, y };
    }
  }
};

/**
 * Find instances where a player has surrounded another player's squares.
 *
 * @param {Object} room - Room to search.
 */
const awardCapturedSquares = (room) => {
  const { grid, players, currentPlayer } = room;

  let captured = findCapturedSquare(grid);
  while (captured) {
    const { x, y, nColor } = captured;

    // Surrounding player (always the current player) takes over
    const owner = grid[y][x].playerName;
    console.log(`Player ${currentPlayer} claimed square ${x}:${y} from ${owner}`);
    grid[y][x].playerName = currentPlayer;
    grid[y][x].color = nColor;
    const newOwnerPlayer = players.find(p => p.playerName === currentPlayer);
    newOwnerPlayer.score += 5 * getSquareValue(grid[y][x].type);
    newOwnerPlayer.conversions++;

    // There could be more
    captured = findCapturedSquare(grid);
  }
};

/**
 * Find sets of 4 or more and mark as a shape to they won't be redeemed again
 *
 * @param {Object} room - Room to search.
 */
const awardCompletedRuns = (room) => {
  const { grid, players } = room;

  const foundRun = findRunOfLength(grid, RUN_LENGTH_MIN);
  if (foundRun) {
    foundRun.locations.forEach(([y, x]) => {
      // Award points for each tile's value
      const ownerPlayer = players.find(p => p.playerName === grid[y][x].playerName);
      grid[y][x].inShape = true;
      ownerPlayer.score += getSquareValue(grid[y][x].type);

      // Remember stats
      ownerPlayer.runs++;
      if (foundRun.locations.length > ownerPlayer.bestRunLength) {
        ownerPlayer.bestRunLength = foundRun.locations.length;
      }
    });
  }
};

/**
 * Find a random unoccupied square.
 *
 * @param {Object[]} grid - Room's grid of squares.
 * @param {Object} bot - Bot player taking their turn.
 * @returns {Object} { x, y } The random move to use.
 */
const findRandomMove = (grid, bot) => {
  let move = { x: randomInt(0, GRID_SIZE - 1), y: randomInt(0, GRID_SIZE - 1) };
  while (grid[move.y][move.x].playerName) {
    move = { x: randomInt(0, GRID_SIZE - 1), y: randomInt(0, GRID_SIZE - 1) };
  }

  console.log(`Bot ${bot.playerName} has no idea what they're doing`);
  return move;
};

/**
 * Find a defensive move, either:
 * - Capping off a run in progress (<4)
 * - Preventing a capture in progress (not all four sides)
 *
 * @param {Object} grid - Room grid to use.
 * @param {Object} bot - Bot player taking their turn.
 * @returns {Object} { x, y } The defensive move to use, or null if not found.
 */
const findDefensiveMove = (grid, bot) => {
  // Cap off a run in progress
  let move = findRunCap(grid, bot, RUN_LENGTH_MIN - 1);
  if (move) return move;

  // TODO Or, defeat a takeover in progress

  // If we can't find any defensive moves, move randomly
  console.log(`Bot ${bot.playerName} grumbles about a lack of defensive moves`);
};

/**
 * Find an offensive move, either:
 * - Continuing a run in progress
 * - Continuing a capture in progress
 *
 * @param {Object} grid - Room grid to use.
 * @param {Object} bot - Bot player taking their turn.
 * @returns {Object} { x, y } The offensive move to use, or null if not found.
 */
const findOffensiveMove = (grid, bot) => {
  // Find a run in progress by this bot
  let move = findRunCap(grid, bot, 1, bot.color);
  if (move) return move;

  // TODO Or, begin a takeover of a completely unsurrounded square

  // If we can't find any defensive moves, move randomly
  console.log(`Bot ${bot.playerName} grumbles about a lack of offensive moves`);
};

/**
 * Emulate a bot thinking, then taking their turn.
 *
 * @param {Object[]} room - Room to use.
 * @param {Object} bot - Bot player taking their turn.
 */
const emulateBotMove = (room, bot) => {
  const { level } = bot.botData;
  const { grid, isDead } = room;

  // Do something different based on lavel
  let move;
  switch (level) {
    // Easy
    case 0:
      console.log(`Bot ${bot.playerName} is taking it easy`);

      // Chance to play a defensive move
      move = (randomInt(0, 100) < BOT_EASY_CHANCE)
        ? findDefensiveMove(grid, bot)
        : findRandomMove(grid, bot);
      break;
    // Medium - Always plays defensively (preventing runs, captures)
    case 1:
      console.log(`Bot ${bot.playerName} has to think about this`);

      // Chance to play a defensive move
      move = (randomInt(0, 100) < BOT_MEDIUM_CHANCE)
        ? findDefensiveMove(grid, bot)
        // Chance to play an offensive move
        : (randomInt(0, 100) < BOT_MEDIUM_CHANCE)
          ? findOffensiveMove(grid, bot)
          : findRandomMove(grid, bot);
      break;
    // Hard - always takes an aggressive move (make runs, captures)
    case 2:
      console.log(`Bot ${bot.playerName} is taking no prisoners!`);

      // 50/50 defensive or offensive
      move = (randomInt(0, 100) < 50)
        ? findDefensiveMove(grid, bot)
        : findOffensiveMove(grid, bot);
      break;
  }

  if (!move) {
    move = findRandomMove(grid, bot);
  }

  // Apply the move
  console.log(`Bot ${bot.playerName} placed at ${move.x}:${move.y}`);
  grid[move.y][move.x].playerName = bot.playerName;
  grid[move.y][move.x].color = bot.color;
  bot.score += getSquareValue(grid[move.y][move.x].type);

  // Next turn
  endTurn(room);
};

/**
 * Advance to the next player, and do other things that happen then.
 *
 * @param {Object} room - Current room.
 */
const endTurn = (room) => {
  const { players, isDead } = room;
  if (isDead) return;

  // Find tiles surrounded for conversion
  awardCapturedSquares(room);
  awardCompletedRuns(room);

  // Find the next player in the list - must happen after logic that uses currentPlayer
  const nextIndex = (players.findIndex(p => p.playerName === room.currentPlayer) + 1) % players.length;
  room.currentPlayer = players[nextIndex].playerName;

  // Winner?
  room.allSquaresFilled = room.grid
    .every(row => row.every(square => !!square.playerName), false);
  if (room.allSquaresFilled) {
    room.inGame = false;

    // No more moves
    return;
  }

  // If next player is a bot, emulate thinking time, then take a turn
  const nextPlayer = players.find(p => p.playerName === room.currentPlayer);
  if (!nextPlayer.botData) return;

  setTimeout(() => emulateBotMove(room, nextPlayer), 2500 - (nextPlayer.botData.level * 1000));
};

module.exports = {
  endTurn,
};
