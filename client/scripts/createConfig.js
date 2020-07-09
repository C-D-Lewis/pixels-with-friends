const { writeFileSync } = require('fs');

const {
  SERVER_URL = 'localhost',
} = process.env;

const config = {
  serverUrl: SERVER_URL,
};

writeFileSync('config.js', `window.config=${JSON.stringify(config, null, 2)}`, 'utf8');
