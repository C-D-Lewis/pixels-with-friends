/** Size of a grid square */
export const SQUARE_SIZE = 30;

/** Player colors */
export const PlayerColors = [
  { name: 'blue', light: '#2196F3', dark: '#1976D2' },
  { name: 'red', light: '#F44336', dark : '#D32F2F' },
  { name: 'green', light: '#4CAF50', dark : '#388E3C' },
  { name: 'yellow', light: '#FFEB3B', dark : '#FBC02D' },
  { name: 'purple', light: '#9C27B0', dark : '#7B1FA2' },
  { name: 'pink', light: '#F06292', dark : '#EC407A' },
  { name: 'orange', light: '#FF9800', dark : '#F57C00' },
  { name: 'cyan', light: '#00BCD4', dark : '#0097A7' },
];

/** Game pages (there won't be many) */
export const Pages = {
  Landing: 'landing',
  Lobby: 'lobby',
  InGame: 'ingame',
  EndGame: 'endgame',
};

/** Turn time */
export const TURN_TIME_MS = 15000;
