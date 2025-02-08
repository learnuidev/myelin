const { note } = require("@clack/prompts");

const addAiProviderSuccessLog = (config) => {
  if (config.customAiUrl) {
    note(
      `Please dont forget to add AI_X_API_KEY into your .env file :)`,
      "FYI:"
    );
  } else {
    note(`Please dont forget to add AI_API_KEY into your .env file :)`, "FYI:");
  }
};

module.exports = {
  addAiProviderSuccessLog,
};
