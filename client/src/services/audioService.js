const cache = {};

/**
 * Play an audio file.
 *
 * @param {string} fileName - File name.
 */
const play = (fileName) => {
  if (cache[fileName]) {
    cache[fileName].currentTime = 0;
    cache[fileName].play();
    return;
  }

  cache[fileName] = new Audio(`assets/audio/${fileName}`);
  cache[fileName].play();
};

const audioService = { play };

export default audioService;
