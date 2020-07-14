/**
 * Test a room or player name is valid input.
 *
 * @param {string} name - Room or player name proposed.
 * @returns {boolean} true if the name is valid.
 */
export const nameIsValid = name => name && name.length > 1 && !name.includes(' ');

/**
 * Get a query param.
 *
 * @param {string} name - Param to find.
 * @returns {string} found value.
 */
export const getQueryParam = name => new URLSearchParams(window.location.search).get(name);

/**
 * Get a random integer in a range.
 *
 * @param {number} min - Minimum value.
 * @param {numberr} max - Maximum value to use.
 * @returns {number} The random integer.
 */
export const randomInt = (min, max) => Math.round(Math.random() * (max - min)) + min;

/**
 * Generate a new room name.
 *
 * @returns {string} Room name.
 */
export const generateRoomName = () => {
  const adjectives = ['Happy', 'Quiet', 'Scary', 'Deep', 'Fast', 'Quick', 'Fearsome', 'Speedy', 'Calm', 'Peaceful'];
  const colors = ['Red', 'Green', 'Blue', 'Yellow', 'Purple', 'Black', 'White', 'Orange', 'Violet', 'Teal'];
  const animals = ['Panda', 'Cat', 'Poodle', 'Zebra', 'Lobster', 'Panther', 'Tiger', 'Frog', 'Duck', 'Terrier'];

  const adj = adjectives[randomInt(0, adjectives.length - 1)];
  const color = colors[randomInt(0, colors.length - 1)];
  const animal = animals[randomInt(0, animals.length - 1)];
  return `${adj}${color}${animal}`;
};
