/**
 * Middleware to enable browser pre-flight requests.
 *
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * @param {Function} next - Callback for next middleware.
 */
const enablePreflight = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', '*');
  next();
};

/**
 * Middleware to print all requests.
 *
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * @param {Function} next - Callback for next middleware.
 */
const printRequest = (req, res, next) => {
  console.log(`${req.method} ${req.path}?${JSON.stringify(req.query)} ${JSON.stringify(req.body)}`);
  next();
};

module.exports = {
  enablePreflight,
  printRequest,
};
