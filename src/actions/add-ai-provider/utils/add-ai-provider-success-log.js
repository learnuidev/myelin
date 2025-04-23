const { note } = require("@clack/prompts");

const envMapper = {
  openai: "OPENAI_API_KEY",
  deepseek: "DEEPSEEK_API_KEY",
  qwen: "QWEN_API_KEY",
  mistral: "MISTRAL_API_KEY",
  moonshot: "MOONSHOT_API_KEY",
  claude: "CLAUDE_API_KEY",
  google: "GOOGLE_API_KEY",
};

const addAiProviderSuccessLog = (config) => {
  if (config.customAiUrl) {
    note(
      `Please dont forget to add AI_X_API_KEY into your .env file :)`,
      "FYI:"
    );
  } else if (config.aiProviders) {
    const totalKeys = [
      ...new Set(
        Object.values(config.aiProviders)
          .map((item) => item.aiProvider)
          .map((provider) => {
            return envMapper?.[provider];
          })
      ),
    ]?.join(", ");
    note(
      `Please dont forget to add the following keys: ${totalKeys} into your .env file :)`,
      "FYI:"
    );
  } else {
    note(`Please dont forget to add AI_API_KEY into your .env file :)`, "FYI:");
  }
};

module.exports = {
  addAiProviderSuccessLog,
};
