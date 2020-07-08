const express = require('express');
const bodyParser = require('body-parser');
const { enablePreflight, printRequest } = require('./middleware');
const { handleGetRoom, handleGetRoomGrid, handlePutRoomPlayer } = require('./api/roomApi');

/** Port to use */
const PORT = process.env.PORT || 5500;

/**
 * The main function.
 */
const main = () => {
  const app = express();
  app.use(bodyParser.json());
  app.use(enablePreflight);
  app.use(printRequest);

  app.get('/rooms/:roomName', handleGetRoom);
  app.get('/rooms/:roomName/grid', handleGetRoomGrid);
  app.put('/rooms/:roomName/player', handlePutRoomPlayer);

  app.listen(PORT, () => console.log(`Server is listening on ${PORT}`));
};

main();