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

  const url = `assets/audio/${fileName}`;
  const audio = new Audio(url);
  cache[fileName] = audio;
  audio.play();
};

const audioService = {
  play,
};

export default audioService;
