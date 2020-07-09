const express = require('express');
const bodyParser = require('body-parser');
const { enablePreflight, printRequest } = require('./middleware');
const {
  handleGetRoom,
  handlePutRoomPlayer,
  handlePutRoomInGame,
  monitorPlayerLastSeen,
} = require('./api/roomApi');

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

  app.get('/rooms/:roomName', handleGetRoom);
  app.put('/rooms/:roomName/player', handlePutRoomPlayer);
  app.put('/rooms/:roomName/inGame', handlePutRoomInGame);

  app.listen(PORT, () => console.log(`Server is listening on ${PORT}`));

  monitorPlayerLastSeen();
};

main();