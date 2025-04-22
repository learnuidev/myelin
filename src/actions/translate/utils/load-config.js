const { translationProviders } = require("../constants/translation-providers");
const { readFile } = require("./read-file");

const defaultConfig = JSON.stringify(
  {
    aiProvider: translationProviders.openai,
    aiModel: "gpt-4o-mini",
    locale: {
      location: "locales",
      sourceLanguage: "en",
      targetLanguages: ["es", "fr", "zh"],
    },
  },
  null,
  4
);

async function loadConfig(options = { throw: false }) {
  // step 1: read config

  const errorMessage = `config not found. Please create a file called: myelin.config.json in root directory and fill in this info:
  
  ${defaultConfig}
`;

  const configPath = "myelin.config.json";
  try {
    const config = await readFile(configPath, options);

    if (!config) {
      return;
    }

    return JSON.parse(config);

    // eslint-disable-next-line no-unused-vars
  } catch (err) {
    throw new Error(errorMessage);
  }
}

module.exports = {
  loadConfig,
};
