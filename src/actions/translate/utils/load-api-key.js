require("dotenv").config();

async function loadApiKey() {
  // eslint-disable-next-line no-undef
  const aiApiKey = process.env.AI_API_KEY;

  if (!aiApiKey) {
    throw new Error("Api Key not found");
  }

  return aiApiKey;
}

module.exports = {
  loadApiKey,
};
