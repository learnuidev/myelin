const { readFile } = require("./read-file");

async function loadConfig() {
  // step 1: read config
  const config = await readFile("myelin.config.json");

  if (!config) {
    throw new Error(`config not found. Please create a file called: myelin.config.json in root directory and fill in this info:
{
  "aiProvider": "openai",
  "aiModel": "gpt-4o-mini",
  "locale": {
    "location": "locales",
    "sourceLanguage": "en",
    "targetLanguages": ["es", "fr", "zh"]
  }
}
`);
  }

  return JSON.parse(config);
}

module.exports = {
  loadConfig,
};
