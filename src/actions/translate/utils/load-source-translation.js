const { readFile } = require("./read-file");

async function loadSourceTranslation({ config }) {
  const localeLocation = config.locale.location;

  const sourceTranslation = await readFile(
    `./${localeLocation}/${config.locale.sourceLanguage}.json`
  );

  if (!sourceTranslation) {
    throw new Error(`Source translation not found`);
  }

  return JSON.parse(sourceTranslation);
}

module.exports = {
  loadSourceTranslation,
};
