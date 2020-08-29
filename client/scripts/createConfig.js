const { writeFileSync } = require('fs');

const {
  /** Server URL, including protocol */
  SERVER_URL,
} = process.env;

const config = {
  serverUrl: SERVER_URL,
};

if (!SERVER_URL) {
  throw new Error('Export SERVER_URL');
}

writeFileSync('config.js', `window.config=${JSON.stringify(config, null, 2)}`, 'utf8');
