const { readFile } = require("./read-file");

async function loadTranslation(path) {
  try {
    const sourceTranslation = await readFile(`./${path}`);

    return JSON.parse(sourceTranslation);
    // eslint-disable-next-line no-unused-vars
  } catch (err) {
    return {};
  }
}

module.exports = {
  loadTranslation,
};
