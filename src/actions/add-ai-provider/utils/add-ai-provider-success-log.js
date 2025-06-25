const { note, outro } = require("@clack/prompts");
const picocolors = require("picocolors");

const envMapper = {
  openai: "OPENAI_API_KEY",
  deepseek: "DEEPSEEK_API_KEY",
  qwen: "QWEN_API_KEY",
  mistral: "MISTRAL_API_KEY",
  moonshot: "MOONSHOT_API_KEY",
  claude: "CLAUDE_API_KEY",
  google: "GOOGLE_API_KEY",
  deepl: "DEEPL_API_KEY",
};

const addAiProviderSuccessLog = (config, overrideLanguages) => {
  if (config.customAiUrl) {
    note(
      `Please dont forget to add AI_X_API_KEY into your .env file :)`,
      "FYI:"
    );
  } else if (config.aiProviders) {
    const totalKeys = (
      overrideLanguages
        ? [
            ...new Set(
              Object.entries(config.aiProviders)
                .filter((item) => overrideLanguages?.includes(item[0]))
                .map((item) => item[1].aiProvider)
                .map((provider) => {
                  return envMapper?.[provider];
                })
            ),
          ]
        : [
            ...new Set(
              Object.values(config.aiProviders)
                .map((item) => item.aiProvider)
                .map((provider) => {
                  return envMapper?.[provider];
                })
            ),
          ]
    )?.filter((item) => process.env?.[item]);

    if (totalKeys?.length > 0) {
      note(
        `Please dont forget to add the following keys: ${totalKeys?.join(", ")} into your .env file :)`,
        "FYI:"
      );
    }
  } else {
    note(`Please dont forget to add AI_API_KEY into your .env file :)`, "FYI:");
  }
};

module.exports = {
  addAiProviderSuccessLog,
};
