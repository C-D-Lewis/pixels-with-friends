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
 * @param {string} owner - Owner of the run start.
 * @param {number} y - Starting Y coorindate.
 * @param {number} x - Starting X coorindate.
 * @param {number} dy - Y delta.
 * @param {number} dx - X delta.
 * @param {number} minLength - Minimum length to count.
 * @returns {Object} List of run grid locations, along with specified directions.
 */
const findRun = (grid, owner, y, x, dy, dx, minLength) => {
  const locations = [];
  let j = y; i = x;

  // Find run on the grid, with an owner that matches the origin owner, not in a shape
  while (isInGrid(i, j) && grid[j][i].playerName && grid[j][i].playerName === owner && !grid[j][i].inShape) {
    locations.push([j, i]);
    j += dy;
    i += dx;
  }

  // Must reach minLength to be valid
  return (locations.length < minLength)
    ? null
    : { x, y, locations, dx, dy, owner };
};

/**
 * Find a run on the grid of a given length
 *
 * @param {Array[]} grid - List of grid rows.
 * @param {number} minLength - Minimum length to count.
 * @param {string} findOwner - Optional owner to search for
 * @returns {Object} List of run grid locations, along with specified directions.
 */
const findRunOfLength = (grid, minLength, findOwner) => {
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const owner = grid[y][x].playerName;
      if (!owner) continue;
      if (findOwner && owner !== findOwner) continue;

      // Try all of north, south, east, west until a run is found
      const foundRun = findRun(grid, owner, y, x, -1, 0, minLength)
        || findRun(grid, owner, y, x, 1, 0, minLength)
        || findRun(grid, owner, y, x, 0, 1, minLength)
        || findRun(grid, owner, y, x, 0, 1, minLength);

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
 * @param {string} owner - Optional run owner to search for.
 * @returns {Object} { x, y } The random move to use.
 */
const findRunCap = (grid, bot, minLength, owner) => {
  const foundRun = findRunOfLength(grid, minLength, owner);
  if (foundRun) {
    const { x, y, dx, dy } = foundRun;
    console.log(`Bot ${bot.playerName} sees opportunity at ${x}:${y}`);

    // Move is the next in the run sequence, but could be owned already
    let runCap = { x: x + (minLength * dx), y: y + (minLength * dy) };
    if (!isInGrid(runCap.x, runCap.y) || grid[runCap.y][runCap.x].playerName) {
      // Try the other end
      runCap = { x: x - dx, y: y - dy };
    }

    // FIXME - Gets stuck on the first already defeated run found
    if (!isInGrid(runCap.x, runCap.y) || grid[runCap.y][runCap.x].playerName) {
      console.log(`Bot ${bot.playerName} would totally have used that run`);
      return;
    }
    return runCap;
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
      const owner = grid[y][x].playerName;
      if (!owner) continue;

      const nOwner = grid[y - 1][x].playerName && grid[y - 1][x].playerName;
      const sOwner = grid[y + 1][x].playerName && grid[y + 1][x].playerName;
      const eOwner = grid[y][x + 1].playerName && grid[y][x + 1].playerName;
      const wOwner = grid[y][x - 1].playerName && grid[y][x - 1].playerName;

      // If all cardinal owners are the same, and not the owner
      const neighbors = [nOwner, sOwner, eOwner, wOwner];
      if (!nOwner || !neighbors.every(p => p === nOwner) || nOwner === owner) continue;

      return { nOwner, owner, x, y };
    }
  }
}

/**
 * Find instances where a player has surrounded another player's squares.
 *
 * @param {Object} room - Room to search.
 */
const awardCapturedSquares = (room) => {
  const { grid, players } = room;

  let captured = findCapturedSquare(grid);
  while (captured) {
    const { x, y, nOwner, owner } = captured;

    // Surrounding player takes over
    console.log(`Player ${nOwner} claimed square ${x}:${y} from ${owner}`);
    grid[y][x].playerName = nOwner;
    const nOwnerPlayer = players.find(p => p.playerName === nOwner);
    nOwnerPlayer.score += 5 * getSquareValue(grid[y][x].type);
    nOwnerPlayer.conversions++;

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
    // Award points for each tile's value
    const ownerPlayer = players.find(p => p.playerName === foundRun.owner);
    foundRun.locations.forEach(([b, a]) => {
      grid[b][a].inShape = true;
      ownerPlayer.score += getSquareValue(grid[b][a].type);
    });

    // Remember stats
    ownerPlayer.runs++;
    if (foundRun.locations.length > ownerPlayer.bestRunLength) {
      ownerPlayer.bestRunLength = foundRun.locations.length;
    }
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
  let move = findRunCap(grid, bot, 1, bot.playerName);
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

  // Find the next player in the list
  const nextIndex = (players.findIndex(p => p.playerName === room.currentPlayer) + 1) % players.length;
  room.currentPlayer = players[nextIndex].playerName;

  // Find tiles surrounded for conversion
  awardCapturedSquares(room);
  awardCompletedRuns(room);

  // Winner?
  room.allSquaresFilled = room.grid
    .every(row => row.every(square => !!square.playerName), false);
  if (room.allSquaresFilled) {
    room.inGame = false;
  }

  // If next player is a bot, emulate thinking time, then take a turn
  const nextPlayer = players.find(p => p.playerName === room.currentPlayer);
  if (!nextPlayer.botData) return;

  setTimeout(() => emulateBotMove(room, nextPlayer), 2500 - (nextPlayer.botData.level * 1000));
};

module.exports = {
  awardCompletedRuns,
  awardCapturedSquares,
  endTurn,
  emulateBotMove,
};
