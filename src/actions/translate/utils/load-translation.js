const { readFile } = require("./read-file");

async function loadTranslation(path) {
  const sourceTranslation = await readFile(`./${path}`);

  return JSON.parse(sourceTranslation);
}

module.exports = {
  loadTranslation,
};
