const { omit } = require('lodash');

const {
  GRID_SIZE,
  PlayerColors,
  randomInt,
  createRoom,
  createPlayer,
  createBot,
  findSurroundedSquares,
  findCompletedRuns,
  getSquareValue,
  goToNextPlayer,
} = require('./util');

/** Max players */
const MAX_PLAYERS = 8;
/** Interval between lastSeen checks. */
const PLAYER_LAST_SEEN_INTERVAL_MS = 5000;
/** Max time after which a player is deemed MIA */
const PLAYER_LAST_SEEN_MAX_MS = 10000;

// All games stored only in memory - they are short lived
const rooms = [];

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

/**
 * Handle GET /rooms requests. A summary is returned
 *
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 */
const handleGetRooms = (req, res) => res.status(200).json({ rooms: rooms.map(p => omit(p, 'grid'))});

/**
 * Handle GET /room/:roomName requests.
 *
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 */
const handleGetRoom = (req, res) => {
  const { roomName } = req.params;
  const { playerName } = req.query;
  if (!roomName) return res.status(400).json({ error: 'roomName not specified' });

  // If room doesn't exist, create it
  let room = rooms.find(p => p.roomName === roomName);
  if (!room) {
    room = createRoom(roomName);
    rooms.push(room);
    console.log(`Room ${roomName} created`);
  }

  // If a player requested, update the player's lastSeen
  if (playerName) {
    const player = room.players.find(p => p.playerName === playerName);
    if (player) {
      player.lastSeen = Date.now();
    }
  }

  return res.status(200).json(room);
};

/**
 * Handle PUT /room/:roomName/player requests.
 *
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 */
const handlePutRoomPlayer = (req, res) => {
  const room = getRoomOrRespond(req, res);
  if (!room) return;
  if (room.players.length === MAX_PLAYERS) return res.status(409).json({ error: 'Room is full' });

  const { playerName } = req.body;
  let player = room.players.find(p => p.playerName === playerName);
  if (player) return res.status(409).json({ error: 'Player already in the room' });

  const nextIndex = room.players.length;
  player = createPlayer(playerName, nextIndex);
  console.log(`Player ${playerName} joined ${room.roomName}`);

  // Mark the host, who must stay for the length of the game
  if (nextIndex === 0) {
    player.isHost = true;
    room.currentPlayer = player.playerName;
  }

  room.players.push(player);
  return res.status(200).json(room);
};

/**
 * Handle PUT /room/:roomName/inLobby requests.
 *
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 */
const handlePutRoomInGame = (req, res) => {
  const room = getRoomOrRespond(req, res);
  if (!room) return;

  // Set the game as in progress, clients poll for this
  room.inGame = true;
  console.log(`Room ${room.roomName} is now in game`);
  return res.status(200).json(room);
};

/**
 * Handle POST /room/:roomName/square requests.
 *
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 */
const handlePostRoomSquare = (req, res) => {
  const { playerName, row, col } = req.body;

  const room = getRoomOrRespond(req, res);
  if (!room) return;
  const player = room.players.find(p => p.playerName === playerName);
  if (!player) return res.status(404).json({ error: 'Player not found' });

  // Set ownership and aware points - client validates it is a free square
  const { grid, players } = room;
  grid[row][col].playerName = playerName;
  player.score += getSquareValue(grid[row][col].type);
  console.log(`Player ${playerName} placed at ${col}:${row}`);

  // Find tiles surrounded for conversion
  findSurroundedSquares(room);
  findCompletedRuns(room);

  // Winner?
  room.allSquaresFilled = grid
    .every(row => row.every(square => !!square.playerName), false);
  if (room.allSquaresFilled) {
    room.inGame = false;
  }

  // Next player's turn - has to be done by name in case players drop out
  goToNextPlayer(room);

  // Respond with new roomState
  return res.status(200).json(room);
};

/**
 * Handle POST /room/:roomName/testEndGame requests.
 *
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 */
const handlePostRoomTestEndgame = (req, res) => {
  const room = getRoomOrRespond(req, res);
  if (!room) return;

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const playerIndex = randomInt(0, room.players.length - 1);
      room.grid[row][col].playerName = room.players[playerIndex].playerName;
    }
  }

  // Don't complete right away
  room.grid[1][0].playerName = null;

  // Respond with new roomState
  return res.status(200).json(room);
};

/**
 * Handle POST /room/:roomName/nextTurn requests.
 *
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 */
const handlePostRoomNextTurn = (req, res) => {
  const room = getRoomOrRespond(req, res);
  if (!room) return;

  goToNextPlayer(room);

  // Respond with new roomState
  res.status(200).json(room);
};

/**
 * Handle POST /room/:roomName/players/:playerName/nextColor requests.
 *
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 */
const handlePutRoomPlayerNextColor = (req, res) => {
  const room = getRoomOrRespond(req, res);
  if (!room) return;
  const player = getPlayerOrRespond(req, res);
  if (!player) return;

  const currentColor = PlayerColors.find(p => p.name === player.color);
  const nextIndex = (PlayerColors.indexOf(currentColor) + 1) % PlayerColors.length;
  player.color = PlayerColors[nextIndex].name;

  // Respond with new roomState
  return res.status(200).json(room);
};

/**
 * Handle PUT /room/:roomName/bot requests.
 *
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 */
const handlePutRoomBot = (req, res) => {
  const room = getRoomOrRespond(req, res);
  if (!room) return;

  // Insert a player, type bot. Assign random friendly name and color.
  const nextIndex = room.players.length;
  const bot = createBot(nextIndex, room);
  console.log(`Bot ${bot.playerName} joined ${room.roomName}`);

  room.players.push(bot);
  return res.status(200).json(room);
};

/**
 * Handle PUT /room/:roomName/bot/:playerName/nextLevel requests.
 * Cycles 1, 2, 3, 1, 2, 3...
 *
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 */
const handlePutRoomBotNextLevel = (req, res) => {
  const room = getRoomOrRespond(req, res);
  if (!room) return;
  const player = getPlayerOrRespond(req, res);
  if (!player) return;

  console.log(player)
};

/**
 * Monitor players for their pings and remove those not seen for a while.
 */
const monitorPlayerLastSeen = () => {
  setInterval(() => {
    const now = Date.now();

    rooms.forEach((room) => {
      // If the room now has no human players, free it up
      if (room.players.length === 0 || room.players.every(p => p.botData)) {
        console.log(`Removing empty room ${room.roomName}`);
        room.isDead = true;
        rooms.splice(rooms.indexOf(room), 1);
        return;
      }

      // Time out players who have closed the game
      room.players.forEach((player, index) => {
        // Bots don't leave until all humans have
        if (player.botData) return;

        // Players who didn't query roomState for a while get removed
        const diff = now - player.lastSeen;
        if (diff < PLAYER_LAST_SEEN_MAX_MS) return;

        console.log(`Removing player ${player.playerName} from ${room.roomName} after ${diff / 1000}s`);
        room.players.splice(room.players.indexOf(player), 1);

        // If the player taking a turn leaves, move on to the next player
        if (room.currentPlayer === player.playerName) {
          goToNextPlayer(room);
        }
      });
    });
  }, PLAYER_LAST_SEEN_INTERVAL_MS);
};

module.exports = {
  handleGetRooms,
  handleGetRoom,
  handlePutRoomPlayer,
  handlePutRoomInGame,
  handlePostRoomSquare,
  handlePostRoomTestEndgame,
  handlePostRoomNextTurn,
  handlePutRoomPlayerNextColor,
  handlePutRoomBot,
  handlePutRoomBotNextLevel,
  monitorPlayerLastSeen,
};
