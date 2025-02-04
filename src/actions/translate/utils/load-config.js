const { readFile } = require("./read-file");

const fs = require("fs").promises;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const defaultConfig = {
  aiProvider: "openai",
  aiModel: "gpt-4o-mini",
  locale: {
    location: "locales",
    sourceLanguage: "en",
    targetLanguages: ["es", "fr", "zh"],
  },
};

async function loadConfig() {
  // step 1: read config

  const errorMessage = `config not found. Please create a file called: myelin.config.json in root directory and fill in this info:
  
  ${JSON.stringify(defaultConfig)}
`;

  const configPath = "myelin.config.json";
  try {
    let config;

    config = await readFile(configPath, { throw: false });

    if (!config) {
      console.log(`${configPath} not found. Writing a default one`);
      await fs.writeFile(configPath, JSON.stringify(defaultConfig, null, 4));

      console.log(`${name}: successfully installed`);
    }

    config = await defaultConfig;

    return JSON.parse(config);
    // eslint-disable-next-line no-unused-vars
  } catch (err) {
    throw new Error(errorMessage);
  }
}

module.exports = {
  loadConfig,
};
