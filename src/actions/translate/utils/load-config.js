const { readFile } = require("./read-file");

async function loadConfig() {
  // step 1: read config

  const errorMessage = `config not found. Please create a file called: myelin.config.json in root directory and fill in this info:
{
  "aiProvider": "openai",
  "aiModel": "gpt-4o-mini",
  "locale": {
    "location": "locales",
    "sourceLanguage": "en",
    "targetLanguages": ["es", "fr", "zh"]
  }
}
`;
  try {
    const config = await readFile("myelin.config.json");

    if (!config) {
      throw new Error(errorMessage);
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
