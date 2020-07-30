const { writeFileSync } = require('fs');

const {
  SERVER_URL,
} = process.env;

const config = {
  serverUrl: SERVER_URL,
};

if (!SERVER_URL) {
  throw new Error('Export SERVER_URL');
}

writeFileSync('config.js', `window.config=${JSON.stringify(config, null, 2)}`, 'utf8');
