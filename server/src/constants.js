/** Size of the grid */
const GRID_SIZE = 9;
/** Basic score for a single square */
const SCORE_AMOUNT_SINGLE = 10;
/** Minimum run length */
const RUN_LENGTH_MIN = 4;
/** Chance a square is a double square */
const DOUBLE_SQUARE_CHANCE = 10;
/** Change to place defensively as an easy bot */
const BOT_EASY_CHANCE = 10;
/** Change to place defensively as a medium bot */
const BOT_MEDIUM_CHANCE = 40;
/** Max players */
const MAX_PLAYERS = 8;
/** Interval between lastSeen checks. */
const PLAYER_LAST_SEEN_INTERVAL_MS = 5000;
/** Max time after which a player is deemed MIA */
const PLAYER_LAST_SEEN_MAX_MS = 10000;
/** Number of bot levels */
const NUM_BOT_LEVELS = 3;

/** Player colors - must sync */
const PlayerColors = [
  { name: 'blue',   light: '#2196F3', dark: '#1976D2' },
  { name: 'red',    light: '#F44336', dark: '#D32F2F' },
  { name: 'green',  light: '#4CAF50', dark: '#388E3C' },
  { name: 'yellow', light: '#FFEB3B', dark: '#FBC02D' },
  { name: 'purple', light: '#9C27B0', dark: '#7B1FA2' },
  { name: 'pink',   light: '#F06292', dark: '#EC407A' },
  { name: 'orange', light: '#FF9800', dark: '#F57C00' },
  { name: 'cyan',   light: '#00BCD4', dark: '#0097A7' },
];

/** Special square types - must sync */
const SquareTypes = {
  Single: 'single',
  Double: 'double',
};

/** Bot names */
const BotNames = [
  'Buttons',
  'Curious',
  'Tinker',
  'Twobit',
  'Core',
  'Scrap',
  'Spark',
  'Socket',
  'Pins',
  'Occular',
  'Flash',
  'Ratchet',
];

module.exports = {
  GRID_SIZE,
  SCORE_AMOUNT_SINGLE,
  RUN_LENGTH_MIN,
  DOUBLE_SQUARE_CHANCE,
  BOT_EASY_CHANCE,
  BOT_MEDIUM_CHANCE,
  MAX_PLAYERS,
  PLAYER_LAST_SEEN_MAX_MS,
  PLAYER_LAST_SEEN_INTERVAL_MS,
  NUM_BOT_LEVELS,
  PlayerColors,
  SquareTypes,
  BotNames,
};
