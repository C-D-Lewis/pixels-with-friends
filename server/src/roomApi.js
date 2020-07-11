const { omit } = require('lodash');

const {
  GRID_SIZE,
  SCORE_AMOUNT_SINGLE,
  createRoom,
  createPlayer,
  findSurroundedSquares,
  findRuns,
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
  const { roomName } = req.params;
  const { playerName } = req.body;

  const room = rooms.find(p => p.roomName === roomName);
  if (!room) return res.status(404).json({ error: 'Room not found' });
  if (room.players.length === MAX_PLAYERS) return res.status(409).json({ error: 'Room is full' });
  let player = room.players.find(p => p.playerName === playerName);
  if (player) return res.status(409).json({ error: 'Player already in the room' });

  player = createPlayer(playerName);
  console.log(`Player ${playerName} joined ${roomName}`);

  // Mark the host, who must stay for the length of the game
  if (room.players.length === 0) {
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
  const { roomName } = req.params;
  const room = rooms.find(p => p.roomName === roomName);
  if (!room) return res.status(404).json({ error: 'Room not found' });

  // Set the game as in progress, clients poll for this
  room.inGame = true;
  console.log(`Room ${roomName} is now in game`);
  return res.status(200).json(room);
};

/**
 * Handle POST /room/:roomName/square requests.
 *
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 */
const handlePostRoomSquare = (req, res) => {
  const { roomName } = req.params;
  const { playerName, row, col } = req.body;

  const room = rooms.find(p => p.roomName === roomName);
  if (!room) return res.status(404).json({ error: 'Room not found' });
  const player = room.players.find(p => p.playerName === playerName);
  if (!player) return res.status(404).json({ error: 'Player not found' });

  // Set ownership and aware points - client validates it is a free square
  console.log(`Player ${playerName} placed at ${col}:${row}`);
  room.grid[row][col].playerName = playerName;
  player.score += SCORE_AMOUNT_SINGLE;

  // Find tiles surrounded for conversion
  findSurroundedSquares(room);
  findRuns(room);

  // Winner?
  room.allSquaresFilled = room.grid.reduce((acc, row) => {
    if (acc) return acc;

    return row.every(square => !!square.playerName);
  }, false);
  if (room.allSquaresFilled) {
    room.inGame = false;
  }

  // Next player's turn - has to be done by name in case players drop out
  const nextPlayerIndex = (room.players.indexOf(player) + 1) % room.players.length;
  room.currentPlayer = room.players[nextPlayerIndex].playerName;

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
  const { roomName } = req.params;

  const room = rooms.find(p => p.roomName === roomName);
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      room.grid[row][col].playerName = room.players[0].playerName;
    }
  }

  // Don't complete right away
  room.grid[0][0].playerName = null;

  // Respond with new roomState
  return res.status(200).json(room);
};

/**
 * Monitor players for their pings and remove those not seen for a while.
 */
const monitorPlayerLastSeen = () => {
  setInterval(() => {
    const now = Date.now();

    rooms.forEach((room) => {
      room.players.forEach((player, index) => {
        // Players who didn't query roomState for a while get removed
        const diff = now - player.lastSeen;
        if (diff < PLAYER_LAST_SEEN_MAX_MS) return;

        console.log(`Removing player ${player.playerName} from ${room.roomName} after ${diff / 1000}s`);
        room.players.splice(room.players.indexOf(player), 1);

        // If the player taking a turn leaves, move on to the next player
        if (room.currentPlayer === player.playerName) {
          const nextPlayer = room.players[(index + 1) % room.players.length];
          if (!nextPlayer) return;

          room.currentPlayer = nextPlayer.playerName;
        }
      });

      // If the room now has no players, free it up
      if (room.players.length === 0) {
        console.log(`Removing empty room ${room.roomName}`);
        rooms.splice(rooms.indexOf(room), 1);
      }
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
  monitorPlayerLastSeen,
};
