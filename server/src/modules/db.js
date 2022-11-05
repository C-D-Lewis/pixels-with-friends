const { find } = require('./mongo');

const { ROOM_COLLECTION } = require('../constants');

const getRooms = async () => {
  const rooms = await find(ROOM_COLLECTION);
  console.log(rooms);
};

module.exports = {
  getRooms,
};
