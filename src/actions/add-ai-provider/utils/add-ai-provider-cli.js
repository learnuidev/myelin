const { select, text } = require("@clack/prompts");
const { getPlaceholderModel } = require("./get-placeholder-model");
const { getProviderModelOptions } = require("./get-provider-model-options");

const addAiProviderCli = async () => {
  const aiProvider = await select({
    message: "Enter your ai provider",
    placeholder: "deepseek",
    options: [
      { value: "openai", label: "Openai" },
      { value: "deepseek", label: "Deepseek" },
      { value: "qwen", label: "Qwen" },
      { value: "moonshot", label: "Moonshot" },
      { value: "custom", label: "Custom" },
    ],
  });

  let aiModel;

  if (aiProvider !== "custom") {
    aiModel = await select({
      message: "Enter your preferred ai model",
      placeholder: getPlaceholderModel(aiProvider),
      options: getProviderModelOptions(aiProvider),
    });
  }

  let customAiUrl;

  if (aiProvider === "custom") {
    customAiUrl = await text({
      message: "Enter the url of your custom ai model",
      placeholder: "https://www.myaimodel.com",
      validate: (value) => {
        if (!value) return "This cannot be empty";
        return;
      },
    });
  }

  return {
    aiProvider,
    aiModel,
    customAiUrl,
  };
};

module.exports = {
  addAiProviderCli,
};
