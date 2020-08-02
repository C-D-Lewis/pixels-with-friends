const { omit } = require('lodash');
const { rooms } = require('../modules/data');

/**
 * Handle GET /rooms requests. A summary is returned
 *
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 */
const handleGetRooms = (req, res) => res
  .status(200)
  .json({ rooms: rooms.map(p => omit(p, 'grid'))});

module.exports = handleGetRooms;
