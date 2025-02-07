require("dotenv").config();

async function loadXApiKey({ config }) {
  // eslint-disable-next-line no-undef
  const aiXApiKey = process.env.AI_X_API_KEY;

  if (!aiXApiKey) {
    throw new Error(
      `API Key for ${config.customAiUrl} not found. Please add AI_X_API_KEY in your .env file and try again :)`
    );
  }

  return aiXApiKey;
}

module.exports = {
  loadXApiKey,
};
