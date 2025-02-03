require("dotenv").config();

async function loadApiKey({ config }) {
  // eslint-disable-next-line no-undef
  const aiApiKey = process.env.AI_API_KEY;

  if (!aiApiKey) {
    throw new Error(
      `API Key for ${config.aiProvider}  not found. Please add AI_API_KEY in your .env file and try again :)`
    );
  }

  return aiApiKey;
}

module.exports = {
  loadApiKey,
};
