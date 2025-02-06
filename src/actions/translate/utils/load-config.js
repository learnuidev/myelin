const { note } = require("@clack/prompts");
const { readFile } = require("./read-file");

const fs = require("fs").promises;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const defaultConfig = JSON.stringify(
  {
    aiProvider: "openai",
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

async function loadConfig() {
  // step 1: read config

  const errorMessage = `config not found. Please create a file called: myelin.config.json in root directory and fill in this info:
  
  ${defaultConfig}
`;

  const configPath = "myelin.config.json";
  try {
    let config;

    config = await readFile(configPath, { throw: false });

    if (!config) {
      note(
        "myelin.config.json not found. Please run `npx myelino` to create one",
        "Error"
      );

      return;
    }

    if (config) {
      return JSON.parse(config);
    } else {
      return JSON.parse(defaultConfig);
    }

    // eslint-disable-next-line no-unused-vars
  } catch (err) {
    throw new Error(errorMessage);
  }
}

module.exports = {
  loadConfig,
};
