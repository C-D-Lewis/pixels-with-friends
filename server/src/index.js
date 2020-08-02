const express = require('express');
const bodyParser = require('body-parser');
const { enablePreflight, printRequest } = require('./modules/middleware');
const {
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
} = require('./modules/api');

/** Port to use */
const PORT = process.env.PORT || 5500;

/**
 * The main function.
 */
const main = () => {
  const app = express();
  app.use(bodyParser.json());
  app.use(enablePreflight);
  // app.use(printRequest);

  app.get('/rooms', handleGetRooms);
  app.get('/rooms/:roomName', handleGetRoom);
  app.put('/rooms/:roomName/player', handlePutRoomPlayer);
  app.put('/rooms/:roomName/players/:playerName/nextColor', handlePutRoomPlayerNextColor);
  app.put('/rooms/:roomName/inGame', handlePutRoomInGame);
  app.post('/rooms/:roomName/square', handlePostRoomSquare);
  app.post('/rooms/:roomName/testEndGame', handlePostRoomTestEndgame);
  app.post('/rooms/:roomName/nextTurn', handlePostRoomNextTurn);
  app.put('/rooms/:roomName/bots', handlePutRoomBot);
  app.put('/rooms/:roomName/bots/:playerName/nextLevel', handlePutRoomBotNextLevel);

  app.listen(PORT, () => console.log(`Server is listening on ${PORT}`));

  monitorPlayerLastSeen();
};

main();